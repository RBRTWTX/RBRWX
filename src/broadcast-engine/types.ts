export type SceneTransitionKind = 'fly' | 'ease' | 'dissolve' | 'cut';
export type SceneAdvanceMode = 'manual' | 'automatic';

export interface SceneTransitionSpec {
  type: SceneTransitionKind;
  durationMs: number;
}

export interface ScenePlayoutSettings {
  transition: SceneTransitionSpec;
  holdSeconds: number;
  advance: SceneAdvanceMode;
}

export interface BroadcastEngineState {
  playing: boolean;
}

export const DEFAULT_SCENE_PLAYOUT_SETTINGS: ScenePlayoutSettings = {
  transition: { type: 'fly', durationMs: 1800 },
  holdSeconds: 10,
  advance: 'manual',
};

export const DEFAULT_BROADCAST_ENGINE_STATE: BroadcastEngineState = {
  playing: false,
};

export function createDefaultScenePlayoutSettings(): ScenePlayoutSettings {
  return structuredClone(DEFAULT_SCENE_PLAYOUT_SETTINGS);
}

export function createDefaultBroadcastEngineState(): BroadcastEngineState {
  return structuredClone(DEFAULT_BROADCAST_ENGINE_STATE);
}
