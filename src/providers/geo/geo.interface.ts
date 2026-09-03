export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeofenceCheckResult {
  isWithin: boolean;
  distanceMeters: number;
  allowedRadiusMeters: number;
}

export interface GeoProvider {
  calculateDistanceMeters(point1: Coordinates, point2: Coordinates): number;
  isWithinGeofence(employeeLoc: Coordinates, branchLoc: Coordinates, radiusMeters: number): GeofenceCheckResult;
}