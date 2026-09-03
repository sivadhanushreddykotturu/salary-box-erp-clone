"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Compass, Search, Building2, CheckCircle2 } from "lucide-react";

export function LocationTrackingView() {
  const branches = [
    { name: "HQ Bangalore", coords: "12.9716° N, 77.5946° E", radius: 100, activeStaff: 4, address: "MG Road, Central Business District, Bangalore" },
    { name: "VIJAYAWADA Office", coords: "16.5062° N, 80.6480° E", radius: 150, activeStaff: 6, address: "GM2F+G66, P48, Auto Nagar, Vijayawada" },
    { name: "Addanki Branch", coords: "15.8122° N, 79.9723° E", radius: 100, activeStaff: 2, address: "Main Road, Opp Bus Stand, Addanki" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-800">Branch Geofences & Live Location Tracking</h1>
          <p className="text-xs text-slate-500">Real-time GPS office radius geofence radar & field staff map</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {branches.map((b, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">{b.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                {b.radius}m Radius
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{b.address}</p>
            <div className="text-[10px] font-mono text-slate-400">{b.coords}</div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold">{b.activeStaff} Staff Inside Geofence</span>
              <span className="text-[#007BFF] font-semibold hover:underline cursor-pointer">Edit Geofence</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}