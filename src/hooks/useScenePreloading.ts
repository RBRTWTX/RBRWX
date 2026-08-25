import { useEffect, useRef, type Dispatch } from 'react';
import { preloadScene } from '../data/preload-registry';
import type { SceneInstance, WorkspaceAction } from '../types/workspace';

export function useScenePreloading(
  scenes: SceneInstance[],
  dispatch: Dispatch<WorkspaceAction>,
): void {
  const running = useRef(new Set<string>());

  useEffect(() => {
    for (const scene of scenes) {
      if (scene.dataState !== 'queued' || running.current.has(scene.id)) continue;
      running.current.add(scene.id);
      dispatch({ type: 'scene/data', sceneId: scene.id, state: 'loading', message: 'Loading requested scene data…' });

      void preloadScene(scene).then((result) => {
        dispatch({
          type: 'scene/data',
          sceneId: scene.id,
          state: result.state,
          message: result.message,
        });
      }).catch((error) => {
        dispatch({
          type: 'scene/data',
          sceneId: scene.id,
          state: 'error',
          message: error instanceof Error ? error.message : String(error),
        });
      }).finally(() => {
        running.current.delete(scene.id);
      });
    }
  }, [dispatch, scenes]);
}
