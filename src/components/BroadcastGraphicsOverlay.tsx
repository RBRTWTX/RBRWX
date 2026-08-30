import type { CSSProperties } from 'react';
import type { BroadcastGraphicsSettingsPatch } from '../types/workspace';
import type {
  BroadcastGraphicGeometry,
  BroadcastGraphicsProfileOverride,
  BroadcastGraphicsRuntimeMetadata,
  BroadcastGraphicsState,
} from '../graphics/types';
import { resolveBroadcastGraphics } from '../graphics/resolve-overlay';
import { BroadcastEditableText } from './BroadcastEditableText';
import { BroadcastGraphicFrame } from './BroadcastGraphicFrame';

interface BroadcastGraphicsOverlayProps {
  profileId: string;
  graphics: BroadcastGraphicsState;
  interactive: boolean;
  metadata?: BroadcastGraphicsRuntimeMetadata;
  onProfile?: (profileId: string, patch: Partial<BroadcastGraphicsProfileOverride>) => void;
  onSettings?: (patch: BroadcastGraphicsSettingsPatch) => void;
}

const FALLBACK_GEOMETRY: Record<string, BroadcastGraphicGeometry> = {
  'title-bar': { x: 1, y: 2.5, width: 98, height: 108 },
  'lower-third': { x: 4, y: 78, width: 92, height: 64 },
  'live-ticker': { x: 4, y: 87, width: 92, height: 38 },
};

export function BroadcastGraphicsOverlay({
  profileId,
  graphics,
  interactive,
  metadata,
  onProfile,
  onSettings,
}: BroadcastGraphicsOverlayProps) {
  const resolved = resolveBroadcastGraphics(profileId, graphics, metadata);
  const geometry = graphics.geometry ?? FALLBACK_GEOMETRY;
  const titleGeometry = geometry['title-bar'] ?? FALLBACK_GEOMETRY['title-bar'];
  const lowerThirdGeometry = geometry['lower-third'] ?? FALLBACK_GEOMETRY['lower-third'];
  const tickerGeometry = geometry['live-ticker'] ?? FALLBACK_GEOMETRY['live-ticker'];

  const layerStyle = {
    '--rbr-gradient-start': graphics.gradientStart,
    '--rbr-gradient-middle': graphics.gradientMiddle,
    '--rbr-gradient-end': graphics.gradientEnd,
    '--title-height': `${titleGeometry.height}px`,
    '--title-opacity': graphics.titleBarOpacity,
    '--lower-third-opacity': graphics.lowerThirdOpacity,
  } as CSSProperties;

  function changeGeometry(graphicId: string, nextGeometry: BroadcastGraphicGeometry): void {
    if (!onSettings) return;
    onSettings({
      geometry: {
        ...geometry,
        [graphicId]: nextGeometry,
      },
    });
  }

  return (
    <div
      className={`broadcast-graphics-layer ${interactive ? 'is-interactive' : ''}`}
      style={layerStyle}
      data-profile={resolved?.profileId ?? profileId}
    >
      {resolved?.titleBarVisible && (
        <BroadcastGraphicFrame
          graphicId="title-bar"
          className="broadcast-title-frame"
          geometry={titleGeometry}
          interactive={interactive}
          minWidth={40}
          minHeight={72}
          onGeometry={changeGeometry}
          title="Drag the title bar to move it. Drag the corner handle to resize it. Click text to edit."
        >
          <header className={`broadcast-title-bar variant-${resolved.titleBarVariant}`}>
            <div className="broadcast-title-cap" aria-hidden="true">
              <span />
            </div>
            <div className="broadcast-title-copy">
              <div className="broadcast-title-row">
                <BroadcastEditableText
                  as="h1"
                  className="broadcast-title-text"
                  value={resolved.title}
                  interactive={interactive}
                  label="title bar title"
                  onChange={(value) => onProfile?.(resolved.profileId, { title: value })}
                />
                {resolved.validLabel && (
                  <BroadcastEditableText
                    as="span"
                    className="broadcast-valid-label"
                    value={resolved.validLabel}
                    interactive={interactive}
                    label="title bar valid label"
                    onChange={(value) => onProfile?.(resolved.profileId, { validLabel: value })}
                  />
                )}
              </div>

              <div className="broadcast-title-lower-row">
                <BroadcastEditableText
                  as="span"
                  className="broadcast-subtitle-text"
                  value={resolved.subtitle}
                  interactive={interactive}
                  label="title bar subtitle"
                  onChange={(value) => onProfile?.(resolved.profileId, { subtitle: value })}
                />

                {resolved.colorKeyVisible && resolved.colorKey && (
                  <section className="broadcast-title-color-key" aria-label={`${resolved.colorKey.name} color key`}>
                    <div className="title-key-heading">
                      <strong>{resolved.colorKey.name}</strong>
                      {resolved.colorKey.units && <span>{resolved.colorKey.units}</span>}
                    </div>
                    <div className="title-key-track">
                      {resolved.colorKey.stops.map((stop) => (
                        <span className="title-key-stop" key={`${resolved.colorKey?.id}-${stop.label}`}>
                          <i style={{ backgroundColor: stop.color }} />
                          <small>{stop.label}</small>
                        </span>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </header>
        </BroadcastGraphicFrame>
      )}

      {graphics.lowerThirdVisible && (
        <BroadcastGraphicFrame
          graphicId="lower-third"
          className="broadcast-lower-third-frame"
          geometry={lowerThirdGeometry}
          interactive={interactive}
          minWidth={24}
          minHeight={40}
          onGeometry={changeGeometry}
          title="Drag the lower third to move it. Drag the corner handle to resize it. Click text to edit."
        >
          <div className="broadcast-lower-third-main">
            <div className="broadcast-lower-third-transition" key={graphics.lowerThirdText}>
              <BroadcastEditableText
                as="div"
                className="broadcast-lower-third-text"
                value={graphics.lowerThirdText}
                interactive={interactive}
                label="lower-third text"
                onChange={(value) => onSettings?.({ lowerThirdText: value })}
              />
            </div>
          </div>
        </BroadcastGraphicFrame>
      )}

      {graphics.tickerVisible && (
        <BroadcastGraphicFrame
          graphicId="live-ticker"
          className="broadcast-ticker-frame"
          geometry={tickerGeometry}
          interactive={interactive}
          minWidth={24}
          minHeight={26}
          onGeometry={changeGeometry}
          title="Drag the live ticker to move it. Drag the corner handle to resize it. Click text to edit."
        >
          <div className="broadcast-ticker-row">
            <div className="broadcast-ticker-window">
              <div className={`broadcast-ticker-track ${graphics.tickerText ? 'is-running' : ''}`}>
                <BroadcastEditableText
                  as="span"
                  className="broadcast-ticker-text"
                  value={graphics.tickerText}
                  interactive={interactive}
                  label="live ticker text"
                  onChange={(value) => onSettings?.({ tickerText: value })}
                />
                {graphics.tickerText && (
                  <span className="broadcast-ticker-repeat" aria-hidden="true">
                    {graphics.tickerText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </BroadcastGraphicFrame>
      )}
    </div>
  );
}
