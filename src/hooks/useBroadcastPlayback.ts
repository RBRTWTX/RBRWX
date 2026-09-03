import { useEffect, type Dispatch } from 'react';
import type { BroadcastEngineState } from '../broadcast-engine/types';
import type { SceneInstance, WorkspaceAction } from '../types/workspace';

export function useBroadcastPlayback(
  scenes: SceneInstance[],
  selectedSceneId: string | null,
  broadcast: BroadcastEngineState,
  dispatch: Dispatch<WorkspaceAction>,
): void {
  useEffect(() => {
    if (!broadcast.playing) return;

    const index = scenes.findIndex((scene) => scene.id === selectedSceneId);
    const scene = index >= 0 ? scenes[index] : null;
    if (!scene || scene.advance !== 'automatic') return;

    const delayMs = Math.max(1, Math.min(600, scene.holdSeconds)) * 1000;
    const timer = window.setTimeout(() => {
      if (index >= scenes.length - 1) {
        dispatch({ type: 'broadcast/stop' });
        return;
      }
      dispatch({ type: 'broadcast/advance', direction: 1 });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [broadcast.playing, dispatch, scenes, selectedSceneId]);
}
