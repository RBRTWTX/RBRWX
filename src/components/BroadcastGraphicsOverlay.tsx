import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import type { BroadcastGraphicsSettingsPatch } from '../types/workspace';
import type {
  BroadcastGraphicsProfileOverride,
  BroadcastGraphicsRuntimeMetadata,
  BroadcastGraphicsState,
} from '../graphics/types';
import { resolveBroadcastGraphics } from '../graphics/resolve-overlay';
import { BroadcastEditableText } from './BroadcastEditableText';

interface BroadcastGraphicsOverlayProps {
  profileId: string;
  graphics: BroadcastGraphicsState;
  interactive: boolean;
  metadata?: BroadcastGraphicsRuntimeMetadata;
  onProfile?: (profileId: string, patch: Partial<BroadcastGraphicsProfileOverride>) => void;
  onSettings?: (patch: BroadcastGraphicsSettingsPatch) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function BroadcastGraphicsOverlay({
  profileId,
  graphics,
  interactive,
  metadata,
  onProfile,
  onSettings,
}: BroadcastGraphicsOverlayProps) {
  const resolved = resolveBroadcastGraphics(profileId, graphics, metadata);

  const layerStyle = {
    '--rbr-gradient-start': graphics.gradientStart,
    '--rbr-gradient-middle': graphics.gradientMiddle,
    '--rbr-gradient-end': graphics.gradientEnd,
    '--title-top': `${graphics.titleBarTop}px`,
    '--title-inset': `${graphics.titleBarInset}px`,
    '--title-height': `${graphics.titleBarHeight}px`,
    '--title-opacity': graphics.titleBarOpacity,
    '--lower-third-left': `${graphics.lowerThirdX}%`,
    '--lower-third-top': `${graphics.lowerThirdY}%`,
    '--lower-third-width': `${graphics.lowerThirdWidth}%`,
    '--lower-third-height': `${graphics.lowerThirdHeight}px`,
    '--ticker-height': `${graphics.tickerHeight}px`,
    '--lower-third-opacity': graphics.lowerThirdOpacity,
  } as CSSProperties;

  function beginLowerThirdDrag(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!interactive || !onSettings || event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest('[contenteditable="true"]')) return;

    const layer = event.currentTarget.parentElement;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const startLeft = rect.left + rect.width * graphics.lowerThirdX / 100;
    const startTop = rect.top + rect.height * graphics.lowerThirdY / 100;
    const grabX = event.clientX - startLeft;
    const grabY = event.clientY - startTop;
    const totalHeight = (graphics.lowerThirdVisible ? graphics.lowerThirdHeight : 0)
      + (graphics.tickerVisible ? graphics.tickerHeight : 0);
    const maxX = Math.max(0, 100 - graphics.lowerThirdWidth);
    const maxY = Math.max(0, 100 - (totalHeight / Math.max(rect.height, 1)) * 100);

    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const x = ((moveEvent.clientX - grabX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - grabY - rect.top) / rect.height) * 100;
      onSettings({
        lowerThirdX: Math.round(clamp(x, 0, maxX)),
        lowerThirdY: Math.round(clamp(y, 0, maxY)),
      });
    };

    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop, { once: true });
    window.addEventListener('pointercancel', stop, { once: true });
  }

  return (
    <div
      className={`broadcast-graphics-layer ${interactive ? 'is-interactive' : ''}`}
      style={layerStyle}
      data-profile={resolved?.profileId ?? profileId}
    >
      {resolved?.titleBarVisible && (
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
              <BroadcastEditableText
                as="span"
                className="broadcast-valid-label"
                value={resolved.validLabel}
                interactive={interactive}
                label="title bar valid label"
                onChange={(value) => onProfile?.(resolved.profileId, { validLabel: value })}
              />
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
      )}

      {(graphics.lowerThirdVisible || graphics.tickerVisible) && (
        <div
          className="broadcast-lower-third"
          onPointerDown={beginLowerThirdDrag}
          title={interactive ? 'Drag the bar to move it. Click text to edit.' : undefined}
        >
          {graphics.lowerThirdVisible && (
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
          )}

          {graphics.tickerVisible && (
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
          )}
        </div>
      )}
    </div>
  );
}
