import type { CSSProperties } from 'react';
import type { BroadcastGraphicsRuntimeMetadata, BroadcastGraphicsState } from '../graphics/types';
import { resolveBroadcastGraphics } from '../graphics/resolve-overlay';

interface BroadcastGraphicsOverlayProps {
  profileId: string;
  graphics: BroadcastGraphicsState;
  metadata?: BroadcastGraphicsRuntimeMetadata;
  preview?: boolean;
}

function positionClass(position: BroadcastGraphicsState['colorKeyPosition']): string {
  return `key-${position}`;
}

export function BroadcastGraphicsOverlay({
  profileId,
  graphics,
  metadata,
  preview = false,
}: BroadcastGraphicsOverlayProps) {
  const resolved = resolveBroadcastGraphics(profileId, graphics, metadata);
  if (!resolved) return null;

  const layerStyle = {
    '--title-top': `${graphics.titleBarTop}px`,
    '--title-inset': `${graphics.titleBarInset}px`,
    '--title-opacity': graphics.titleBarOpacity,
    '--title-scale': graphics.titleScale,
    '--key-scale': graphics.colorKeyScale,
  } as CSSProperties;

  return (
    <div
      className={`broadcast-graphics-layer ${preview ? 'graphics-preview-layer' : ''}`}
      style={layerStyle}
      data-profile={resolved.profileId}
    >
      {resolved.titleBarVisible && (
        <header className={`broadcast-title-bar variant-${resolved.titleBarVariant}`}>
          <div className="broadcast-title-copy">
            <strong>{resolved.title}</strong>
            {resolved.subtitle && <span>{resolved.subtitle}</span>}
          </div>
          {resolved.validLabel && <span className="broadcast-valid-label">{resolved.validLabel}</span>}
        </header>
      )}

      {resolved.colorKeyVisible && resolved.colorKey && (
        <section
          className={`broadcast-color-key ${positionClass(graphics.colorKeyPosition)}`}
          aria-label={`${resolved.colorKey.name} color key`}
        >
          <div className="color-key-heading">
            <strong>{resolved.colorKey.name}</strong>
            {resolved.colorKey.units && <span>{resolved.colorKey.units}</span>}
          </div>
          <div className="color-key-track">
            {resolved.colorKey.stops.map((stop) => (
              <div className="color-key-stop" key={`${resolved.colorKey?.id}-${stop.label}`}>
                <i style={{ backgroundColor: stop.color }} />
                <span>{stop.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
