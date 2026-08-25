import type { CameraState } from '../types/workspace';

export const TEXAS_HOME_CAMERA = {
  center: [-99.35, 31.15] as [number, number],
  zoom: 5.0,
  bearing: 0,
  pitch: 0,
} satisfies CameraState;

export function texasHomeCamera(): CameraState {
  return {
    center: [...TEXAS_HOME_CAMERA.center] as [number, number],
    zoom: TEXAS_HOME_CAMERA.zoom,
    bearing: TEXAS_HOME_CAMERA.bearing,
    pitch: TEXAS_HOME_CAMERA.pitch,
  };
}
