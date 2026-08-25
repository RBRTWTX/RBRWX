import { useEffect, useState } from 'react';
import { BroadcastStage } from '../components/BroadcastStage';
import { createDefaultBroadcastGraphicsState } from '../graphics/resolve-overlay';
import type { OutputPayload } from './output-sync';
import { texasHomeCamera } from '../map/home-camera';
import { readOutput, subscribeOutput } from './output-sync';

const FALLBACK: OutputPayload = {
  scene: null,
  coreView: {
    basemap: 'standard',
    camera: texasHomeCamera(),
    context: { cities: true, roads: true, boundaries: true },
  },
  graphics: createDefaultBroadcastGraphicsState(),
  previewOverlayProfileId: null,
  publishedAt: new Date(0).toISOString(),
};

export function OutputApp() {
  const [payload, setPayload] = useState<OutputPayload>(() => readOutput() ?? FALLBACK);

  useEffect(() => subscribeOutput(setPayload), []);

  return (
    <main className="output-app">
      <BroadcastStage
        scene={payload.scene}
        coreView={payload.coreView}
        graphics={payload.graphics}
        previewOverlayProfileId={payload.previewOverlayProfileId}
        interactive={false}
      />
    </main>
  );
}
