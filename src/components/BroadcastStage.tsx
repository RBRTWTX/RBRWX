import { forwardRef } from 'react';
import type {
  BroadcastGraphicsProfileOverride,
  BroadcastGraphicsRuntimeMetadata,
  BroadcastGraphicsState,
} from '../graphics/types';
import { broadcastProfileIdForScene } from '../graphics/resolve-overlay';
import type {
  BroadcastGraphicsSettingsPatch,
  CoreViewState,
  SceneInstance,
} from '../types/workspace';
import { CoreGlobe } from '../map/CoreGlobe';
import { BroadcastGraphicsOverlay } from './BroadcastGraphicsOverlay';

interface BroadcastStageProps {
  scene: SceneInstance | null;
  coreView: CoreViewState;
  graphics: BroadcastGraphicsState;
  interactive: boolean;
  overlayMetadata?: BroadcastGraphicsRuntimeMetadata;
  onSceneCameraChange?: (sceneId: string, camera: SceneInstance['camera']) => void;
  onGraphicsProfile?: (profileId: string, patch: Partial<BroadcastGraphicsProfileOverride>) => void;
  onGraphicsSettings?: (patch: BroadcastGraphicsSettingsPatch) => void;
}

export const BroadcastStage = forwardRef<HTMLDivElement, BroadcastStageProps>(function BroadcastStage(
  {
    scene,
    coreView,
    graphics,
    interactive,
    overlayMetadata,
    onSceneCameraChange,
    onGraphicsProfile,
    onGraphicsSettings,
  },
  ref,
) {
  const view = scene ?? coreView;
  const overlayProfileId = broadcastProfileIdForScene(scene?.overlayProfileId, graphics);

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
        interactive={interactive}
        metadata={overlayMetadata}
        onProfile={onGraphicsProfile}
        onSettings={onGraphicsSettings}
      />
    </div>
  );
});
