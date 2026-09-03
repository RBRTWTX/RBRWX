import type { SceneInstance } from '../types/workspace';

export function firstSceneId(scenes: SceneInstance[]): string | null {
  return scenes[0]?.id ?? null;
}

export function relativeSceneId(
  scenes: SceneInstance[],
  selectedSceneId: string | null,
  direction: -1 | 1,
): string | null {
  if (!scenes.length) return null;
  const current = scenes.findIndex((scene) => scene.id === selectedSceneId);
  const base = current >= 0 ? current : 0;
  const proposed = base + direction;
  const next = Math.max(0, Math.min(scenes.length - 1, proposed));
  return scenes[next]?.id ?? null;
}
