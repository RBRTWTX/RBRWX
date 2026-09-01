export type BroadcastAssetCategoryId =
  | 'alert-warning-watch-advisory'
  | 'radar'
  | 'satellite'
  | 'lightning'
  | 'temperature'
  | 'wind'
  | 'rain-precipitation'
  | 'tropical-hurricane'
  | 'location-marker'
  | 'fronts'
  | 'thunderstorms'
  | 'winter-related'
  | 'heat-related'
  | 'freeze-related';

export interface BroadcastAssetCategory {
  id: BroadcastAssetCategoryId;
  name: string;
}

export type BroadcastAssetArtworkKey =
  | 'alert'
  | 'warning'
  | 'watch'
  | 'advisory'
  | 'radar'
  | 'satellite'
  | 'lightning'
  | 'temperature'
  | 'wind'
  | 'rain'
  | 'hurricane'
  | 'location'
  | 'cold-front'
  | 'warm-front'
  | 'stationary-front'
  | 'occluded-front'
  | 'thunderstorm'
  | 'winter'
  | 'heat'
  | 'freeze';

export interface BroadcastAssetDefinition {
  id: string;
  name: string;
  category: BroadcastAssetCategoryId;
  artworkKey: BroadcastAssetArtworkKey;
  source: 'rbr-alert-box' | 'weather-icons' | 'mdi' | 'nws-front';
}

export const BROADCAST_ASSET_CATEGORIES: readonly BroadcastAssetCategory[] = [
  { id: 'alert-warning-watch-advisory', name: 'Alert / Warning / Watch / Advisory' },
  { id: 'radar', name: 'Radar' },
  { id: 'satellite', name: 'Satellite' },
  { id: 'lightning', name: 'Lightning' },
  { id: 'temperature', name: 'Temperature' },
  { id: 'wind', name: 'Wind' },
  { id: 'rain-precipitation', name: 'Rain / Precipitation' },
  { id: 'tropical-hurricane', name: 'Tropical / Hurricane' },
  { id: 'location-marker', name: 'Location / Marker' },
  { id: 'fronts', name: 'Fronts' },
  { id: 'thunderstorms', name: 'Thunderstorms' },
  { id: 'winter-related', name: 'Winter Related' },
  { id: 'heat-related', name: 'Heat Related' },
  { id: 'freeze-related', name: 'Freeze Related' },
];

export const BROADCAST_ASSET_CATALOG: readonly BroadcastAssetDefinition[] = [
  { id: 'alert', name: 'Alert', category: 'alert-warning-watch-advisory', artworkKey: 'alert', source: 'rbr-alert-box' },
  { id: 'warning', name: 'Warning', category: 'alert-warning-watch-advisory', artworkKey: 'warning', source: 'rbr-alert-box' },
  { id: 'watch', name: 'Watch', category: 'alert-warning-watch-advisory', artworkKey: 'watch', source: 'rbr-alert-box' },
  { id: 'advisory', name: 'Advisory', category: 'alert-warning-watch-advisory', artworkKey: 'advisory', source: 'rbr-alert-box' },
  { id: 'radar', name: 'Radar', category: 'radar', artworkKey: 'radar', source: 'mdi' },
  { id: 'satellite', name: 'Satellite', category: 'satellite', artworkKey: 'satellite', source: 'mdi' },
  { id: 'lightning', name: 'Lightning', category: 'lightning', artworkKey: 'lightning', source: 'weather-icons' },
  { id: 'temperature', name: 'Temperature', category: 'temperature', artworkKey: 'temperature', source: 'weather-icons' },
  { id: 'wind', name: 'Wind', category: 'wind', artworkKey: 'wind', source: 'weather-icons' },
  { id: 'rain', name: 'Rain / Precipitation', category: 'rain-precipitation', artworkKey: 'rain', source: 'weather-icons' },
  { id: 'hurricane', name: 'Tropical / Hurricane', category: 'tropical-hurricane', artworkKey: 'hurricane', source: 'weather-icons' },
  { id: 'location', name: 'Location / Marker', category: 'location-marker', artworkKey: 'location', source: 'mdi' },
  { id: 'cold-front', name: 'Cold Front', category: 'fronts', artworkKey: 'cold-front', source: 'nws-front' },
  { id: 'warm-front', name: 'Warm Front', category: 'fronts', artworkKey: 'warm-front', source: 'nws-front' },
  { id: 'stationary-front', name: 'Stationary Front', category: 'fronts', artworkKey: 'stationary-front', source: 'nws-front' },
  { id: 'occluded-front', name: 'Occluded Front', category: 'fronts', artworkKey: 'occluded-front', source: 'nws-front' },
  { id: 'thunderstorm', name: 'Thunderstorm', category: 'thunderstorms', artworkKey: 'thunderstorm', source: 'weather-icons' },
  { id: 'winter', name: 'Winter', category: 'winter-related', artworkKey: 'winter', source: 'weather-icons' },
  { id: 'heat', name: 'Heat', category: 'heat-related', artworkKey: 'heat', source: 'weather-icons' },
  { id: 'freeze', name: 'Freeze', category: 'freeze-related', artworkKey: 'freeze', source: 'weather-icons' },
];

export function broadcastAssetDefinition(id: string): BroadcastAssetDefinition | undefined {
  return BROADCAST_ASSET_CATALOG.find((asset) => asset.id === id);
}
