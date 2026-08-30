import type { BroadcastOverlayProfile } from './types';

const suppressed = (id: string, name: string): BroadcastOverlayProfile => ({
  id,
  name,
  policy: 'suppressed',
  titleBarVariant: 'standard',
  title: '',
  subtitle: '',
  validLabel: '',
  colorKeyId: null,
});

const standard = (
  id: string,
  name: string,
  title: string,
  subtitle: string,
  validLabel: string,
  colorKeyId: BroadcastOverlayProfile['colorKeyId'],
  titleBarVariant: BroadcastOverlayProfile['titleBarVariant'] = 'standard',
): BroadcastOverlayProfile => ({
  id,
  name,
  policy: 'standard',
  titleBarVariant,
  title,
  subtitle,
  validLabel,
  colorKeyId,
});

export const BROADCAST_OVERLAY_PROFILES: readonly BroadcastOverlayProfile[] = [
  standard('manual-default', 'Blank / Manual Title Bar', '', '', '', null),
  suppressed('none', 'No Broadcast Overlay'),
  suppressed('text-forecast', 'Text Forecast — Standard Overlay Suppressed'),

  standard('radar-ewx', 'EWX Home Radar', 'LIVE DOPPLER RADAR', 'EWX HOME RADAR', 'CURRENT', 'reflectivity'),
  standard('radar-conus', 'CONUS Radar', 'DOPPLER RADAR', 'CONUS', 'CURRENT', 'reflectivity'),
  standard('satellite-enhanced', 'Enhanced Satellite', 'ENHANCED SATELLITE', 'GOES', 'CURRENT', 'infrared'),
  standard('satellite-visible', 'Visible Satellite', 'VISIBLE SATELLITE', 'GOES', 'CURRENT', null),
  standard('observations-temperature', 'Current Temperatures', 'CURRENT TEMPERATURES', 'CURRENT CONDITIONS', 'CURRENT', 'temperature'),
  standard('observations-dewpoint', 'Dew Point Tracker', 'DEW POINT TRACKER', 'CURRENT CONDITIONS', 'CURRENT', 'dewpoint'),
  standard('observations-humidity', 'Relative Humidity', 'RELATIVE HUMIDITY', 'CURRENT CONDITIONS', 'CURRENT', 'humidity'),
  standard('alerts-active', 'Active Weather Alerts', 'ACTIVE WEATHER ALERTS', 'NATIONAL WEATHER SERVICE', 'CURRENT', 'alerts'),
  standard('spc-day1', 'SPC Day 1 Outlook', 'SEVERE WEATHER OUTLOOK', 'SPC DAY 1', 'VALID', 'spc-categorical'),
  standard('spc-mesoscale', 'SPC Mesoscale Discussions', 'MESOSCALE DISCUSSIONS', 'STORM PREDICTION CENTER', 'CURRENT', null),
  standard('rainfall-24h', '24 Hour Rainfall', 'ESTIMATED RAINFALL TOTALS', 'PAST 24 HOURS', 'CURRENT', 'rainfall'),
  standard('forecast-national', 'National Forecast', 'NATIONAL FORECAST', 'FORECAST WEATHER', 'VALID', null),
  standard('forecast-fronts', 'Fronts & Pressure', 'FRONTS & PRESSURE', 'FORECAST WEATHER', 'VALID', null),
  standard('cpc-temperature', '6–10 Day Temperature Outlook', '6–10 DAY TEMPERATURE OUTLOOK', 'CLIMATE PREDICTION CENTER', 'VALID', 'cpc-temperature'),
  standard('cpc-precipitation', '6–10 Day Precipitation Outlook', '6–10 DAY PRECIPITATION OUTLOOK', 'CLIMATE PREDICTION CENTER', 'VALID', 'cpc-precipitation'),
  standard('air-quality', 'Air Quality', 'AIR QUALITY', 'CURRENT CONDITIONS', 'CURRENT', 'aqi'),
  standard('surface-smoke', 'Surface Smoke', 'SURFACE SMOKE', 'CURRENT CONDITIONS', 'CURRENT', 'smoke'),
  standard('tropical-outlook', 'Tropical Weather Outlook', 'TROPICAL WEATHER OUTLOOK', 'NATIONAL HURRICANE CENTER', 'CURRENT', 'tropical-formation', 'tropical'),
  standard('storm-surge-potential', 'Potential Storm Surge', 'POTENTIAL STORM SURGE', 'NATIONAL HURRICANE CENTER', 'VALID', 'storm-surge', 'tropical'),
  standard('storm-surge-peak', 'Peak Storm Surge', 'PEAK STORM SURGE', 'NATIONAL HURRICANE CENTER', 'VALID', 'storm-surge', 'tropical'),
  standard('wind-probability-34', '34 Knot Wind Probability', '34 KNOT WIND PROBABILITY', 'NATIONAL HURRICANE CENTER', 'VALID', 'probability', 'tropical'),
  standard('wind-probability-50', '50 Knot Wind Probability', '50 KNOT WIND PROBABILITY', 'NATIONAL HURRICANE CENTER', 'VALID', 'probability', 'tropical'),
  standard('wind-probability-hurricane', 'Hurricane Wind Probability', 'HURRICANE WIND PROBABILITY', 'NATIONAL HURRICANE CENTER', 'VALID', 'probability', 'tropical'),
  standard('model-hrrr-reflectivity', 'HRRR Composite Reflectivity', 'HRRR COMPOSITE REFLECTIVITY', 'FORECAST MODEL', 'VALID', 'reflectivity', 'model'),
  standard('model-hrrr-temperature', 'HRRR Surface Temperature', 'HRRR SURFACE TEMPERATURE', 'FORECAST MODEL', 'VALID', 'temperature', 'model'),
] as const;

export function overlayProfile(profileId: string): BroadcastOverlayProfile | undefined {
  return BROADCAST_OVERLAY_PROFILES.find((profile) => profile.id === profileId);
}
