import { forwardRef } from 'react';
import type { CoreViewState, SceneInstance } from '../types/workspace';
import { CoreGlobe } from '../map/CoreGlobe';
import { BroadcastHeader } from './BroadcastHeader';

interface BroadcastStageProps {
  scene: SceneInstance | null;
  coreView: CoreViewState;
  interactive: boolean;
  onSceneCameraChange?: (sceneId: string, camera: SceneInstance['camera']) => void;
}

export const BroadcastStage = forwardRef<HTMLDivElement, BroadcastStageProps>(function BroadcastStage(
  { scene, coreView, interactive, onSceneCameraChange },
  ref,
) {
  const view = scene ?? coreView;
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
      {scene && <BroadcastHeader header={scene.header} legend={scene.legend} />}
    </div>
  );
});
