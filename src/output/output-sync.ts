import type { BroadcastGraphicsState } from '../graphics/types';
import type { CoreViewState, SceneInstance } from '../types/workspace';

export interface OutputPayload {
  scene: SceneInstance | null;
  coreView: CoreViewState;
  graphics: BroadcastGraphicsState;
  publishedAt: string;
}

const STORAGE_KEY = 'rbr-wx-output-payload-v3';
const CHANNEL = 'rbr-wx-output-v3';

export function publishOutput(payload: OutputPayload): void {
  const serialized = JSON.stringify(payload);
  localStorage.setItem(STORAGE_KEY, serialized);
  try {
    const channel = new BroadcastChannel(CHANNEL);
    channel.postMessage(payload);
    channel.close();
  } catch {
    // localStorage remains the fallback.
  }
}

export function readOutput(): OutputPayload | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OutputPayload;
  } catch {
    return null;
  }
}

export function subscribeOutput(callback: (payload: OutputPayload) => void): () => void {
  let channel: BroadcastChannel | null = null;
  try {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = (event) => callback(event.data as OutputPayload);
  } catch {
    channel = null;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      callback(JSON.parse(event.newValue) as OutputPayload);
    } catch {
      // Ignore malformed external state.
    }
  };
  window.addEventListener('storage', onStorage);

  return () => {
    channel?.close();
    window.removeEventListener('storage', onStorage);
  };
}
