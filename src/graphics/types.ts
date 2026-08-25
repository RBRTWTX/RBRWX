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
export type ColorKeyPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

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
  titleBarVisible?: boolean;
  colorKeyVisible?: boolean;
  colorKeyId?: ColorKeyId | null;
}

export interface BroadcastGraphicsState {
  enabled: boolean;
  titleBarTop: number;
  titleBarInset: number;
  titleBarOpacity: number;
  titleScale: number;
  colorKeyPosition: ColorKeyPosition;
  colorKeyScale: number;
  previewProfileId: string;
  previewOnStage: boolean;
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
