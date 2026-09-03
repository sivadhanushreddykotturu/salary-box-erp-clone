import { GeoProvider } from './geo.interface';
import { HaversineGeoProvider } from './haversine.geo.provider';

export * from './geo.interface';

export const geoProvider: GeoProvider = new HaversineGeoProvider();