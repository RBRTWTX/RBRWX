import type { ProductDefinition } from '../types/workspace';
import { texasHomeCamera } from '../map/home-camera';

const conus = { center: [-97.5, 38.5] as [number, number], zoom: 3.1, bearing: 0, pitch: 0 };
const ewx = { center: [-98.52, 29.55] as [number, number], zoom: 7.0, bearing: 0, pitch: 0 };
const nationalContext = { cities: true, roads: false, boundaries: true };
const localContext = { cities: true, roads: true, boundaries: true };

function planned(
  id: string,
  name: string,
  group: string,
  providerFamily: string,
  overlayProfileId: string,
  camera = conus,
): ProductDefinition {
  return {
    id,
    name,
    group,
    providerFamily,
    availability: 'planned',
    preloaderId: providerFamily,
    refreshIntervalMs: null,
    defaultBasemap: 'standard',
    defaultCamera: camera,
    defaultContext: group === 'Local' ? localContext : nationalContext,
    overlayProfileId,
  };
}

export const PRODUCT_LIBRARY: ProductDefinition[] = [
  {
    id: 'clear-globe',
    name: 'Clear Globe',
    group: 'Core',
    providerFamily: 'core',
    availability: 'available',
    preloaderId: 'core',
    refreshIntervalMs: null,
    defaultBasemap: 'standard',
    defaultCamera: texasHomeCamera(),
    defaultContext: { cities: true, roads: true, boundaries: true },
    overlayProfileId: 'none',
  },

  planned('ewx-radar', 'EWX Home Radar', 'Radar', 'radar-mrms', 'radar-ewx', ewx),
  planned('conus-radar', 'CONUS Radar', 'Radar', 'radar-mrms', 'radar-conus'),
  planned('enhanced-satellite', 'Enhanced Satellite', 'Satellite', 'satellite-goes', 'satellite-enhanced'),
  planned('visible-satellite', 'Visible Satellite', 'Satellite', 'satellite-goes', 'satellite-visible'),
  planned('current-temperatures', 'Current Temperatures', 'Observations', 'observations', 'observations-temperature'),
  planned('dew-point', 'Dew Point Tracker', 'Observations', 'observations', 'observations-dewpoint'),
  planned('relative-humidity', 'Relative Humidity', 'Observations', 'observations', 'observations-humidity'),
  planned('active-alerts', 'Active Weather Alerts', 'Severe', 'alerts', 'alerts-active', ewx),
  planned('spc-day1', 'SPC Day 1 Outlook', 'SPC', 'spc', 'spc-day1'),
  planned('spc-mesoscale', 'Mesoscale Discussions', 'SPC', 'spc', 'spc-mesoscale'),
  planned('rainfall-24h', '24 Hour Rainfall', 'Rainfall', 'rainfall', 'rainfall-24h', ewx),
  planned('national-forecast', 'National Forecast Chart', 'Forecast', 'forecast', 'forecast-national'),
  planned('text-forecast', 'Text Forecast', 'Forecast', 'forecast-text', 'text-forecast', ewx),
  planned('fronts-pressure', 'Forecast Fronts & Pressure', 'Forecast', 'fronts', 'forecast-fronts'),
  planned('cpc-temp-6-10', '6–10 Day Temperature', 'Climate', 'cpc', 'cpc-temperature'),
  planned('cpc-precip-6-10', '6–10 Day Precipitation', 'Climate', 'cpc', 'cpc-precipitation'),
  planned('air-quality', 'Air Quality', 'Air Quality', 'air-quality', 'air-quality'),
  planned('surface-smoke', 'Surface Smoke', 'Air Quality', 'smoke', 'surface-smoke'),
  planned('nhc-two-day', 'NHC 2 Day Outlook', 'Tropical', 'nhc', 'tropical-outlook'),
  planned('potential-storm-surge', 'Potential Storm Surge', 'Tropical', 'nhc', 'storm-surge-potential'),
  planned('peak-storm-surge', 'Peak Storm Surge', 'Tropical', 'nhc', 'storm-surge-peak'),
  planned('wind-34kt', '34 Knot Wind Probability', 'Tropical', 'nhc', 'wind-probability-34'),
  planned('wind-50kt', '50 Knot Wind Probability', 'Tropical', 'nhc', 'wind-probability-50'),
  planned('hurricane-wind-probability', 'Hurricane Wind Probability', 'Tropical', 'nhc', 'wind-probability-hurricane'),
  planned('hrrr-reflectivity', 'HRRR Composite Reflectivity', 'Models', 'models-hrrr', 'model-hrrr-reflectivity'),
  planned('hrrr-temperature', 'HRRR Surface Temperature', 'Models', 'models-hrrr', 'model-hrrr-temperature'),
];

export const PRODUCT_GROUPS = [...new Set(PRODUCT_LIBRARY.map((item) => item.group))];

export function productDefinition(id: string): ProductDefinition | undefined {
  return PRODUCT_LIBRARY.find((item) => item.id === id);
}
