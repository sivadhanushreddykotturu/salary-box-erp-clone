import { GeoProvider, Coordinates, GeofenceCheckResult } from './geo.interface';

export class HaversineGeoProvider implements GeoProvider {
  calculateDistanceMeters(point1: Coordinates, point2: Coordinates): number {
    const R = 6371e3; // Earth radius in meters
    const phi1 = (point1.latitude * Math.PI) / 180;
    const phi2 = (point2.latitude * Math.PI) / 180;
    const deltaPhi = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const deltaLambda = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  isWithinGeofence(employeeLoc: Coordinates, branchLoc: Coordinates, radiusMeters: number): GeofenceCheckResult {
    const distanceMeters = this.calculateDistanceMeters(employeeLoc, branchLoc);
    return {
      isWithin: distanceMeters <= radiusMeters,
      distanceMeters,
      allowedRadiusMeters: radiusMeters,
    };
  }
}