import { colorKeyDefinition } from './color-key-catalog';
import { overlayProfile } from './overlay-profiles';
import type {
  BroadcastGraphicsRuntimeMetadata,
  BroadcastGraphicsState,
  ResolvedBroadcastGraphics,
} from './types';

export const MANUAL_OVERLAY_PROFILE_ID = 'manual-default';

export const DEFAULT_BROADCAST_GRAPHICS_STATE: BroadcastGraphicsState = {
  titleBarVisible: true,
  autoAssignment: true,
  titleBarTop: 18,
  titleBarInset: 12,
  titleBarHeight: 108,
  titleBarOpacity: 0.96,
  gradientStart: '#032568',
  gradientMiddle: '#531e78',
  gradientEnd: '#cb1678',
  lowerThirdVisible: false,
  tickerVisible: false,
  lowerThirdText: '',
  tickerText: '',
  lowerThirdX: 4,
  lowerThirdY: 78,
  lowerThirdWidth: 92,
  lowerThirdHeight: 64,
  tickerHeight: 38,
  lowerThirdOpacity: 0.96,
  overrides: {},
};

export function createDefaultBroadcastGraphicsState(): BroadcastGraphicsState {
  return structuredClone(DEFAULT_BROADCAST_GRAPHICS_STATE);
}

export function broadcastProfileIdForScene(
  sceneOverlayProfileId: string | null | undefined,
  state: BroadcastGraphicsState,
): string {
  if (sceneOverlayProfileId === 'text-forecast') return 'text-forecast';
  if (state.autoAssignment && sceneOverlayProfileId && sceneOverlayProfileId !== 'none') {
    return sceneOverlayProfileId;
  }
  return MANUAL_OVERLAY_PROFILE_ID;
}

export function resolveBroadcastGraphics(
  profileId: string,
  state: BroadcastGraphicsState,
  metadata: BroadcastGraphicsRuntimeMetadata = {},
): ResolvedBroadcastGraphics | null {
  const profile = overlayProfile(profileId);
  if (!profile || profile.policy === 'suppressed') return null;

  const override = state.overrides[profileId] ?? {};
  const effectiveKeyId = override.colorKeyId !== undefined ? override.colorKeyId : profile.colorKeyId;
  const key = colorKeyDefinition(effectiveKeyId);

  return {
    profileId: profile.id,
    titleBarVariant: profile.titleBarVariant,
    title: override.title ?? metadata.title ?? profile.title,
    subtitle: override.subtitle ?? metadata.subtitle ?? profile.subtitle,
    validLabel: override.validLabel ?? metadata.validLabel ?? profile.validLabel,
    titleBarVisible: state.titleBarVisible,
    colorKeyVisible: (override.colorKeyVisible ?? true) && key !== null,
    colorKey: key,
  };
}
