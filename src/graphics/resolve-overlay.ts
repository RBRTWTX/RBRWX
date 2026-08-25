import { colorKeyDefinition } from './color-key-catalog';
import { overlayProfile } from './overlay-profiles';
import type {
  BroadcastGraphicsRuntimeMetadata,
  BroadcastGraphicsState,
  ResolvedBroadcastGraphics,
} from './types';

export const DEFAULT_BROADCAST_GRAPHICS_STATE: BroadcastGraphicsState = {
  enabled: true,
  titleBarTop: 16,
  titleBarInset: 18,
  titleBarOpacity: 0.88,
  titleScale: 1,
  colorKeyPosition: 'bottom-right',
  colorKeyScale: 1,
  previewProfileId: 'observations-temperature',
  previewOnStage: false,
  overrides: {},
};

export function createDefaultBroadcastGraphicsState(): BroadcastGraphicsState {
  return structuredClone(DEFAULT_BROADCAST_GRAPHICS_STATE);
}

export function resolveBroadcastGraphics(
  profileId: string,
  state: BroadcastGraphicsState,
  metadata: BroadcastGraphicsRuntimeMetadata = {},
): ResolvedBroadcastGraphics | null {
  const profile = overlayProfile(profileId);
  if (!profile || profile.policy === 'suppressed' || !state.enabled) return null;

  const override = state.overrides[profileId] ?? {};
  const effectiveKeyId = override.colorKeyId !== undefined ? override.colorKeyId : profile.colorKeyId;
  const key = colorKeyDefinition(effectiveKeyId);

  return {
    profileId: profile.id,
    titleBarVariant: profile.titleBarVariant,
    title: metadata.title ?? override.title ?? profile.title,
    subtitle: metadata.subtitle ?? override.subtitle ?? profile.subtitle,
    validLabel: metadata.validLabel ?? override.validLabel ?? profile.validLabel,
    titleBarVisible: override.titleBarVisible ?? true,
    colorKeyVisible: (override.colorKeyVisible ?? true) && key !== null,
    colorKey: key,
  };
}
