import type { SceneInstance } from '../types/workspace';
import { sharedDataCache } from './shared-data-cache';

export interface ScenePreloadResult {
  state: 'ready' | 'degraded';
  message: string;
}

export type ScenePreloader = (scene: SceneInstance) => Promise<ScenePreloadResult>;

const preloaders = new Map<string, ScenePreloader>();

preloaders.set('core', async () => ({
  state: 'ready',
  message: 'Core globe ready',
}));

export function registerScenePreloader(id: string, preloader: ScenePreloader): void {
  preloaders.set(id, preloader);
}

export function hasScenePreloader(id: string): boolean {
  return preloaders.has(id);
}

export async function preloadScene(scene: SceneInstance): Promise<ScenePreloadResult> {
  const preloader = preloaders.get(scene.preloaderId);
  if (!preloader) {
    throw new Error(`No preloader registered for ${scene.preloaderId}.`);
  }
  return sharedDataCache.getOrLoad(
    `scene-preload:${scene.providerFamily}:${scene.definitionId}`,
    () => preloader(scene),
  ).then((entry) => entry.value);
}
