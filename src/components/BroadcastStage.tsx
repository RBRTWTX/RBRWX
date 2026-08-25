import { forwardRef } from 'react';
import type { BroadcastGraphicsRuntimeMetadata, BroadcastGraphicsState } from '../graphics/types';
import type { CoreViewState, SceneInstance } from '../types/workspace';
import { CoreGlobe } from '../map/CoreGlobe';
import { BroadcastGraphicsOverlay } from './BroadcastGraphicsOverlay';

interface BroadcastStageProps {
  scene: SceneInstance | null;
  coreView: CoreViewState;
  graphics: BroadcastGraphicsState;
  interactive: boolean;
  overlayMetadata?: BroadcastGraphicsRuntimeMetadata;
  previewOverlayProfileId?: string | null;
  onSceneCameraChange?: (sceneId: string, camera: SceneInstance['camera']) => void;
}

export const BroadcastStage = forwardRef<HTMLDivElement, BroadcastStageProps>(function BroadcastStage(
  {
    scene,
    coreView,
    graphics,
    interactive,
    overlayMetadata,
    previewOverlayProfileId = null,
    onSceneCameraChange,
  },
  ref,
) {
  const view = scene ?? coreView;
  const sceneOverlayProfileId = scene?.overlayProfileId ?? null;
  const overlayProfileId = sceneOverlayProfileId && sceneOverlayProfileId !== 'none'
    ? sceneOverlayProfileId
    : previewOverlayProfileId ?? sceneOverlayProfileId ?? 'none';
  return (
    <div className="broadcast-stage" ref={ref}>
      <CoreGlobe
        basemap={view.basemap}
        camera={view.camera}
        context={view.context}
        interactive={interactive}
        onCameraChange={scene && onSceneCameraChange
          ? (camera) => onSceneCameraChange(scene.id, camera)
          : undefined}
      />
      <BroadcastGraphicsOverlay
        profileId={overlayProfileId}
        graphics={graphics}
        metadata={overlayMetadata}
      />
    </div>
  );
});
