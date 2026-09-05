"use client";

import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Plus, Minus, Layers } from "lucide-react";

interface BranchMapPickerProps {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export function BranchMapPicker({
  latitude,
  longitude,
  radiusMeters,
  onLocationChange,
}: BranchMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [mapType, setMapType] = useState<"map" | "satellite">("map");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Load Leaflet CSS dynamically if not present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up existing map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = latitude || 16.5062;
      const initialLng = longitude || 80.6480;

      // Create Leaflet map instance
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        zoomControl: false, // We use custom styled zoom controls
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Default Road Tile Layer (Google Maps Standard)
      const roadTileLayer = L.tileLayer(
        "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
        {
          maxZoom: 20,
          subdomains: ["mt0", "mt1", "mt2", "mt3"],
        }
      );

      roadTileLayer.addTo(map);
      tileLayerRef.current = roadTileLayer;

      // Custom Red Pin Icon
      const customPinIcon = L.divIcon({
        className: "custom-map-pin-container",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
            <div style="width: 30px; height: 38px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
              <svg width="30" height="38" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 30 12 30C12 30 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z" fill="#EA4335"/>
                <circle cx="12" cy="11" r="5" fill="#FFFFFF"/>
                <circle cx="12" cy="11" r="3" fill="#B31412"/>
              </svg>
            </div>
            <div style="width: 10px; height: 3px; background: rgba(0,0,0,0.3); border-radius: 50%; filter: blur(1px); margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      // Add Draggable Marker
      const marker = L.marker([initialLat, initialLng], {
        icon: customPinIcon,
        draggable: true,
      }).addTo(map);

      markerRef.current = marker;

      // Add Geofence Circle Overlay
      const circle = L.circle([initialLat, initialLng], {
        radius: radiusMeters || 100,
        color: "#2563EB",
        weight: 2,
        fillColor: "#3B82F6",
        fillOpacity: 0.2,
      }).addTo(map);

      circleRef.current = circle;

      // Handle Marker Drag
      marker.on("drag", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        circle.setLatLng([lat, lng]);
      });

      marker.on("dragend", (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        circle.setLatLng([lat, lng]);
        onLocationChange(+lat.toFixed(6), +lng.toFixed(6));
      });

      // Handle Map Click (repositions pin & circle)
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        circle.setLatLng([lat, lng]);
        onLocationChange(+lat.toFixed(6), +lng.toFixed(6));
      });

      setIsLoaded(true);

      // Trigger map resize invalidate
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center & marker position when external coords change
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current || !circleRef.current) return;

    const currentMarkerLatLng = markerRef.current.getLatLng();
    const isDifferent =
      Math.abs(currentMarkerLatLng.lat - latitude) > 0.00001 ||
      Math.abs(currentMarkerLatLng.lng - longitude) > 0.00001;

    if (isDifferent && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      circleRef.current.setLatLng([latitude, longitude]);
      mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1 });
    }
  }, [latitude, longitude]);

  // Update circle radius when radiusMeters changes
  useEffect(() => {
    if (circleRef.current && radiusMeters) {
      circleRef.current.setRadius(radiusMeters);
    }
  }, [radiusMeters]);

  // Switch Tile Layer: Map (Road) vs Satellite (Hybrid)
  const handleMapTypeSwitch = (type: "map" | "satellite") => {
    if (!mapInstanceRef.current) return;
    setMapType(type);

    const L = (window as any).L;
    if (!L) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      type === "satellite"
        ? "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}" // Google Hybrid Satellite
        : "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"; // Google Road Map

    const newLayer = L.tileLayer(tileUrl, {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    });

    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  };

  // Zoom In / Out
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
  };

  return (
    <div
      className={`relative w-full rounded-lg border border-slate-200 overflow-hidden shadow-sm transition-all ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none h-screen bg-white"
          : "h-80 sm:h-96"
      }`}
    >
      {/* Real Interactive Leaflet/Google Maps Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0 bg-[#E5E3DF]" />

      {/* Map / Satellite Layer Switcher in top left (matching SalaryBox) */}
      <div className="absolute top-3 left-3 z-10 flex rounded bg-white shadow-md border border-slate-200 overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => handleMapTypeSwitch("map")}
          className={`px-3 py-1 font-semibold transition-colors cursor-pointer ${
            mapType === "map"
              ? "bg-slate-100 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Map
        </button>
        <button
          type="button"
          onClick={() => handleMapTypeSwitch("satellite")}
          className={`px-3 py-1 font-semibold transition-colors border-l border-slate-200 cursor-pointer ${
            mapType === "satellite"
              ? "bg-slate-100 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Satellite
        </button>
      </div>

      {/* Fullscreen Toggle in top right */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded shadow-md border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </button>

      {/* Custom Zoom Controls in bottom right */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col bg-white rounded shadow-md border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2 text-slate-700 hover:bg-slate-50 border-b border-slate-200 transition-colors cursor-pointer"
          title="Zoom in"
        >
          <Plus className="w-3.5 h-3.5 font-bold" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Zoom out"
        >
          <Minus className="w-3.5 h-3.5 font-bold" />
        </button>
      </div>

      {/* Geofence & Coordinate Overlay in bottom left */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-3 py-1 rounded shadow-md font-mono">
        <span>
          Lat: {latitude ? latitude.toFixed(5) : "0.00000"}, Lng:{" "}
          {longitude ? longitude.toFixed(5) : "0.00000"}
        </span>
        <span className="text-blue-300 font-sans font-semibold">
          ({radiusMeters}m Geofence)
        </span>
      </div>
    </div>
  );
}
