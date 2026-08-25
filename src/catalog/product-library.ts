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
  headerTitle: string,
  legend: ProductDefinition['legend'],
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
    header: { title: headerTitle, subtitle: group.toUpperCase(), validLabel: 'CURRENT' },
    legend,
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
    header: null,
    legend: { kind: 'none' },
  },

  planned('ewx-radar', 'EWX Home Radar', 'Radar', 'radar-mrms', 'LIVE DOPPLER RADAR', { kind: 'reflectivity' }, ewx),
  planned('conus-radar', 'CONUS Radar', 'Radar', 'radar-mrms', 'DOPPLER RADAR', { kind: 'reflectivity' }),
  planned('enhanced-satellite', 'Enhanced Satellite', 'Satellite', 'satellite-goes', 'ENHANCED SATELLITE', { kind: 'infrared' }),
  planned('visible-satellite', 'Visible Satellite', 'Satellite', 'satellite-goes', 'VISIBLE SATELLITE', { kind: 'none' }),
  planned('current-temperatures', 'Current Temperatures', 'Observations', 'observations', 'CURRENT TEMPERATURES', { kind: 'temperature' }),
  planned('dew-point', 'Dew Point Tracker', 'Observations', 'observations', 'DEW POINT TRACKER', { kind: 'dewpoint' }),
  planned('relative-humidity', 'Relative Humidity', 'Observations', 'observations', 'RELATIVE HUMIDITY', { kind: 'custom', label: 'HUMIDITY' }),
  planned('active-alerts', 'Active Weather Alerts', 'Severe', 'alerts', 'ACTIVE WEATHER ALERTS', { kind: 'none' }, ewx),
  planned('spc-day1', 'SPC Day 1 Outlook', 'SPC', 'spc', 'SEVERE WEATHER OUTLOOK', { kind: 'spc' }),
  planned('spc-mesoscale', 'Mesoscale Discussions', 'SPC', 'spc', 'MESOSCALE DISCUSSIONS', { kind: 'none' }),
  planned('rainfall-24h', '24 Hour Rainfall', 'Rainfall', 'rainfall', 'ESTIMATED RAINFALL TOTALS', { kind: 'rainfall' }, ewx),
  planned('national-forecast', 'National Forecast Chart', 'Forecast', 'forecast', 'NATIONAL FORECAST', { kind: 'none' }),
  planned('fronts-pressure', 'Forecast Fronts & Pressure', 'Forecast', 'fronts', 'FRONTS & PRESSURE', { kind: 'none' }),
  planned('cpc-temp-6-10', '6–10 Day Temperature', 'Climate', 'cpc', '6–10 DAY TEMPERATURE OUTLOOK', { kind: 'temperature' }),
  planned('cpc-precip-6-10', '6–10 Day Precipitation', 'Climate', 'cpc', '6–10 DAY PRECIPITATION OUTLOOK', { kind: 'rainfall' }),
  planned('air-quality', 'Air Quality', 'Air Quality', 'air-quality', 'AIR QUALITY', { kind: 'custom', label: 'AQI' }),
  planned('surface-smoke', 'Surface Smoke', 'Air Quality', 'smoke', 'SURFACE SMOKE', { kind: 'custom', label: 'SMOKE' }),
  planned('nhc-two-day', 'NHC 2 Day Outlook', 'Tropical', 'nhc', 'TROPICAL WEATHER OUTLOOK', { kind: 'none' }),
  planned('potential-storm-surge', 'Potential Storm Surge', 'Tropical', 'nhc', 'POTENTIAL STORM SURGE', { kind: 'custom', label: 'SURGE' }),
  planned('peak-storm-surge', 'Peak Storm Surge', 'Tropical', 'nhc', 'PEAK STORM SURGE', { kind: 'custom', label: 'SURGE' }),
  planned('wind-34kt', '34 Knot Wind Probability', 'Tropical', 'nhc', '34 KNOT WIND PROBABILITY', { kind: 'custom', label: 'PROBABILITY' }),
  planned('wind-50kt', '50 Knot Wind Probability', 'Tropical', 'nhc', '50 KNOT WIND PROBABILITY', { kind: 'custom', label: 'PROBABILITY' }),
  planned('hurricane-wind-probability', 'Hurricane Wind Probability', 'Tropical', 'nhc', 'HURRICANE WIND PROBABILITY', { kind: 'custom', label: 'PROBABILITY' }),
  planned('hrrr-reflectivity', 'HRRR Composite Reflectivity', 'Models', 'models-hrrr', 'HRRR COMPOSITE REFLECTIVITY', { kind: 'reflectivity' }),
  planned('hrrr-temperature', 'HRRR Surface Temperature', 'Models', 'models-hrrr', 'HRRR SURFACE TEMPERATURE', { kind: 'temperature' }),
];

export const PRODUCT_GROUPS = [...new Set(PRODUCT_LIBRARY.map((item) => item.group))];

export function productDefinition(id: string): ProductDefinition | undefined {
  return PRODUCT_LIBRARY.find((item) => item.id === id);
}
