export type ColorKeyId =
  | 'reflectivity'
  | 'temperature'
  | 'dewpoint'
  | 'humidity'
  | 'rainfall'
  | 'spc-categorical'
  | 'infrared'
  | 'aqi'
  | 'smoke'
  | 'probability'
  | 'storm-surge'
  | 'cpc-temperature'
  | 'cpc-precipitation'
  | 'tropical-formation'
  | 'alerts';

export type BroadcastOverlayPolicy = 'standard' | 'suppressed';
export type TitleBarVariant = 'standard' | 'model' | 'tropical';

export interface ColorKeyStop {
  label: string;
  color: string;
}

export interface ColorKeyDefinition {
  id: ColorKeyId;
  name: string;
  units: string | null;
  stops: readonly ColorKeyStop[];
}

export interface BroadcastOverlayProfile {
  id: string;
  name: string;
  policy: BroadcastOverlayPolicy;
  titleBarVariant: TitleBarVariant;
  title: string;
  subtitle: string;
  validLabel: string;
  colorKeyId: ColorKeyId | null;
}

export interface BroadcastGraphicsProfileOverride {
  title?: string;
  subtitle?: string;
  validLabel?: string;
  colorKeyVisible?: boolean;
  colorKeyId?: ColorKeyId | null;
}

export interface BroadcastGraphicGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BroadcastGraphicsState {
  titleBarVisible: boolean;
  autoAssignment: boolean;
  titleBarOpacity: number;
  gradientStart: string;
  gradientMiddle: string;
  gradientEnd: string;
  lowerThirdVisible: boolean;
  tickerVisible: boolean;
  lowerThirdText: string;
  tickerText: string;
  lowerThirdOpacity: number;
  geometry: Record<string, BroadcastGraphicGeometry>;
  overrides: Record<string, BroadcastGraphicsProfileOverride>;
}

export interface BroadcastGraphicsRuntimeMetadata {
  title?: string;
  subtitle?: string;
  validLabel?: string;
}

export interface ResolvedBroadcastGraphics {
  profileId: string;
  titleBarVariant: TitleBarVariant;
  title: string;
  subtitle: string;
  validLabel: string;
  titleBarVisible: boolean;
  colorKeyVisible: boolean;
  colorKey: ColorKeyDefinition | null;
}
