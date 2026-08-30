import type { ChangeEvent } from 'react';
import { COLOR_KEY_CATALOG } from '../graphics/color-key-catalog';
import { overlayProfile } from '../graphics/overlay-profiles';
import { resolveBroadcastGraphics } from '../graphics/resolve-overlay';
import type {
  BroadcastGraphicsProfileOverride,
  BroadcastGraphicsState,
  ColorKeyId,
} from '../graphics/types';
import type { BroadcastGraphicsSettingsPatch } from '../types/workspace';

interface BroadcastGraphicsEditorProps {
  open: boolean;
  graphics: BroadcastGraphicsState;
  activeProfileId: string;
  onClose: () => void;
  onSettings: (patch: BroadcastGraphicsSettingsPatch) => void;
  onProfile: (profileId: string, patch: Partial<BroadcastGraphicsProfileOverride>) => void;
  onResetAll: () => void;
}

function numberValue(value: string, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function BroadcastGraphicsEditor({
  open,
  graphics,
  activeProfileId,
  onClose,
  onSettings,
  onProfile,
  onResetAll,
}: BroadcastGraphicsEditorProps) {
  if (!open) return null;

  const profile = overlayProfile(activeProfileId);
  const override = graphics.overrides[activeProfileId] ?? {};
  const resolved = resolveBroadcastGraphics(activeProfileId, graphics);
  const keySelection = override.colorKeyId === undefined
    ? 'auto'
    : override.colorKeyId === null
      ? 'none'
      : override.colorKeyId;

  return (
    <aside className="graphics-editor" aria-label="Broadcast Graphics customization">
      <div className="graphics-editor-heading">
        <div>
          <span>BROADCAST GRAPHICS</span>
          <h2>Bar Customization</h2>
        </div>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="graphics-editor-body">
        <section className="graphics-editor-status">
          <span>Current title-bar assignment</span>
          <strong>{profile?.name ?? 'Blank / Manual Title Bar'}</strong>
          <small>Text is edited directly on the broadcast bars.</small>
        </section>

        <section>
          <div className="section-heading">
            <strong>Title Bar</strong>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.titleBarVisible}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarVisible: event.target.checked })}
            />
            Show title bar
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.autoAssignment}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ autoAssignment: event.target.checked })}
            />
            Auto assign title / key from scene
          </label>

          <label>
            Color key
            <select
              value={keySelection}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;
                onProfile(activeProfileId, {
                  colorKeyId: value === 'auto'
                    ? undefined
                    : value === 'none'
                      ? null
                      : value as ColorKeyId,
                });
              }}
            >
              <option value="auto">Auto — scene default</option>
              <option value="none">None</option>
              {COLOR_KEY_CATALOG.map((key) => (
                <option key={key.id} value={key.id}>{key.name}</option>
              ))}
            </select>
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={override.colorKeyVisible ?? true}
              disabled={!resolved?.colorKey}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(activeProfileId, { colorKeyVisible: event.target.checked })}
            />
            Show color key
          </label>

          <label>
            Top position <output>{graphics.titleBarTop}px</output>
            <input
              type="range"
              min="0"
              max="120"
              step="1"
              value={graphics.titleBarTop}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarTop: numberValue(event.target.value, 18) })}
            />
          </label>

          <label>
            Side inset <output>{graphics.titleBarInset}px</output>
            <input
              type="range"
              min="6"
              max="180"
              step="1"
              value={graphics.titleBarInset}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarInset: numberValue(event.target.value, 12) })}
            />
          </label>

          <label>
            Bar height <output>{graphics.titleBarHeight}px</output>
            <input
              type="range"
              min="72"
              max="150"
              step="1"
              value={graphics.titleBarHeight}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarHeight: numberValue(event.target.value, 108) })}
            />
          </label>

          <label>
            Bar opacity <output>{Math.round(graphics.titleBarOpacity * 100)}%</output>
            <input
              type="range"
              min="0.55"
              max="1"
              step="0.01"
              value={graphics.titleBarOpacity}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarOpacity: numberValue(event.target.value, 0.96) })}
            />
          </label>
        </section>

        <section>
          <div className="section-heading">
            <strong>RBR WX Graphic Colors</strong>
          </div>
          <div className="graphics-color-grid">
            <label>
              Left
              <input
                type="color"
                value={graphics.gradientStart}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ gradientStart: event.target.value })}
              />
            </label>
            <label>
              Middle
              <input
                type="color"
                value={graphics.gradientMiddle}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ gradientMiddle: event.target.value })}
              />
            </label>
            <label>
              Right
              <input
                type="color"
                value={graphics.gradientEnd}
                onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ gradientEnd: event.target.value })}
              />
            </label>
          </div>
        </section>

        <section>
          <div className="section-heading">
            <strong>Lower Third / Live Ticker</strong>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.lowerThirdVisible}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdVisible: event.target.checked })}
            />
            Show lower third
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.tickerVisible}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ tickerVisible: event.target.checked })}
            />
            Show live ticker
          </label>

          <label>
            X position <output>{graphics.lowerThirdX}%</output>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={graphics.lowerThirdX}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdX: numberValue(event.target.value, 4) })}
            />
          </label>

          <label>
            Y position <output>{graphics.lowerThirdY}%</output>
            <input
              type="range"
              min="45"
              max="94"
              step="1"
              value={graphics.lowerThirdY}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdY: numberValue(event.target.value, 78) })}
            />
          </label>

          <label>
            Width <output>{graphics.lowerThirdWidth}%</output>
            <input
              type="range"
              min="30"
              max="100"
              step="1"
              value={graphics.lowerThirdWidth}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdWidth: numberValue(event.target.value, 92) })}
            />
          </label>

          <label>
            Lower-third height <output>{graphics.lowerThirdHeight}px</output>
            <input
              type="range"
              min="40"
              max="120"
              step="1"
              value={graphics.lowerThirdHeight}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdHeight: numberValue(event.target.value, 64) })}
            />
          </label>

          <label>
            Ticker height <output>{graphics.tickerHeight}px</output>
            <input
              type="range"
              min="26"
              max="70"
              step="1"
              value={graphics.tickerHeight}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ tickerHeight: numberValue(event.target.value, 38) })}
            />
          </label>


          <label>
            Bar opacity <output>{Math.round(graphics.lowerThirdOpacity * 100)}%</output>
            <input
              type="range"
              min="0.55"
              max="1"
              step="0.01"
              value={graphics.lowerThirdOpacity}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ lowerThirdOpacity: numberValue(event.target.value, 0.96) })}
            />
          </label>
        </section>

        <div className="graphics-editor-actions">
          <button className="danger" onClick={onResetAll}>Reset Broadcast Graphics</button>
        </div>
      </div>
    </aside>
  );
}
