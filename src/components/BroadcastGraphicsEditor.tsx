import { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { COLOR_KEY_CATALOG } from '../graphics/color-key-catalog';
import { BROADCAST_OVERLAY_PROFILES, overlayProfile } from '../graphics/overlay-profiles';
import { resolveBroadcastGraphics } from '../graphics/resolve-overlay';
import type {
  BroadcastGraphicsProfileOverride,
  BroadcastGraphicsState,
  ColorKeyId,
} from '../graphics/types';
import type { BroadcastGraphicsSettingsPatch } from '../types/workspace';
import { BroadcastGraphicsOverlay } from './BroadcastGraphicsOverlay';

interface BroadcastGraphicsEditorProps {
  open: boolean;
  graphics: BroadcastGraphicsState;
  activeProfileId: string | null;
  onClose: () => void;
  onSettings: (patch: BroadcastGraphicsSettingsPatch) => void;
  onProfile: (profileId: string, patch: Partial<BroadcastGraphicsProfileOverride>) => void;
  onResetProfile: (profileId: string) => void;
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
  onResetProfile,
  onResetAll,
}: BroadcastGraphicsEditorProps) {
  const editableProfiles = useMemo(
    () => BROADCAST_OVERLAY_PROFILES.filter((profile) => profile.policy === 'standard'),
    [],
  );

  if (!open) return null;

  const profileId = overlayProfile(graphics.previewProfileId)?.policy === 'standard'
    ? graphics.previewProfileId
    : editableProfiles[0]?.id ?? 'observations-temperature';
  const profile = overlayProfile(profileId);
  const override = graphics.overrides[profileId] ?? {};
  const resolved = resolveBroadcastGraphics(profileId, graphics);
  const activeProfile = activeProfileId ? overlayProfile(activeProfileId) : undefined;

  const keySelection = override.colorKeyId === undefined
    ? 'auto'
    : override.colorKeyId === null
      ? 'none'
      : override.colorKeyId;
  const colorKeyAvailable = resolved?.colorKey != null;

  return (
    <aside className="graphics-editor" aria-label="Broadcast Graphics editor">
      <div className="graphics-editor-heading">
        <div>
          <span>BROADCAST GRAPHICS</span>
          <h2>Title Bar & Color Keys</h2>
        </div>
        <button onClick={onClose}>Close</button>
      </div>

      <div className="graphics-editor-body">
        <section className="graphics-editor-status">
          <span>Active scene overlay</span>
          <strong>
            {activeProfile
              ? `${activeProfile.name}${activeProfile.policy === 'suppressed' ? ' — SUPPRESSED' : ''}`
              : 'No weather scene selected'}
          </strong>
          <small>Weather scenes only identify an overlay profile. They do not own title-bar or key graphics.</small>
        </section>

        <section>
          <label>
            Edit / preview profile
            <select
              value={profileId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onSettings({ previewProfileId: event.target.value })}
            >
              {editableProfiles.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
          {activeProfile?.policy === 'standard' && activeProfile.id !== profileId && (
            <button
              className="secondary-action"
              onClick={() => onSettings({ previewProfileId: activeProfile.id })}
            >
              Edit Active Scene Profile
            </button>
          )}
          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.previewOnStage}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ previewOnStage: event.target.checked })}
            />
            Preview this profile on map / Present / PNG when no scene is selected
          </label>
        </section>

        <div className="graphics-editor-preview">
          <div className="graphics-preview-map">
            <span>MAP / WEATHER CONTENT</span>
          </div>
          <BroadcastGraphicsOverlay profileId={profileId} graphics={graphics} preview />
        </div>

        <section className="graphics-control-grid">
          <label className="wide">
            Title
            <input
              value={override.title ?? profile?.title ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(profileId, { title: event.target.value })}
            />
          </label>
          <label>
            Subtitle
            <input
              value={override.subtitle ?? profile?.subtitle ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(profileId, { subtitle: event.target.value })}
            />
          </label>
          <label>
            Valid / Time Label
            <input
              value={override.validLabel ?? profile?.validLabel ?? ''}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(profileId, { validLabel: event.target.value })}
            />
          </label>

          <label>
            Color key
            <select
              value={keySelection}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                const value = event.target.value;
                onProfile(profileId, {
                  colorKeyId: value === 'auto'
                    ? undefined
                    : value === 'none'
                      ? null
                      : value as ColorKeyId,
                });
              }}
            >
              <option value="auto">Auto — profile default</option>
              <option value="none">None</option>
              {COLOR_KEY_CATALOG.map((key) => (
                <option key={key.id} value={key.id}>{key.name}</option>
              ))}
            </select>
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={override.titleBarVisible ?? true}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(profileId, { titleBarVisible: event.target.checked })}
            />
            Show title bar
          </label>

          <label className="check-row">
            <input
              type="checkbox"
              checked={(override.colorKeyVisible ?? true) && colorKeyAvailable}
              disabled={!colorKeyAvailable}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onProfile(profileId, { colorKeyVisible: event.target.checked })}
            />
            Show color key
          </label>
        </section>

        <section className="graphics-layout-controls">
          <div className="section-heading">
            <strong>Shared Layout</strong>
            <span>Applies to all standard title bars</span>
          </div>

          <label className="check-row">
            <input
              type="checkbox"
              checked={graphics.enabled}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ enabled: event.target.checked })}
            />
            Enable Broadcast Graphics
          </label>

          <label>
            Title bar top <output>{graphics.titleBarTop}px</output>
            <input
              type="range"
              min="0"
              max="80"
              step="1"
              value={graphics.titleBarTop}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarTop: numberValue(event.target.value, 16) })}
            />
          </label>
          <label>
            Side inset <output>{graphics.titleBarInset}px</output>
            <input
              type="range"
              min="0"
              max="120"
              step="1"
              value={graphics.titleBarInset}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarInset: numberValue(event.target.value, 18) })}
            />
          </label>
          <label>
            Title opacity <output>{Math.round(graphics.titleBarOpacity * 100)}%</output>
            <input
              type="range"
              min="0.4"
              max="1"
              step="0.02"
              value={graphics.titleBarOpacity}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleBarOpacity: numberValue(event.target.value, 0.88) })}
            />
          </label>
          <label>
            Title scale <output>{graphics.titleScale.toFixed(2)}×</output>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={graphics.titleScale}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ titleScale: numberValue(event.target.value, 1) })}
            />
          </label>
          <label>
            Key position
            <select
              value={graphics.colorKeyPosition}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onSettings({
                colorKeyPosition: event.target.value as BroadcastGraphicsState['colorKeyPosition'],
              })}
            >
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </label>
          <label>
            Key scale <output>{graphics.colorKeyScale.toFixed(2)}×</output>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={graphics.colorKeyScale}
              onChange={(event: ChangeEvent<HTMLInputElement>) => onSettings({ colorKeyScale: numberValue(event.target.value, 1) })}
            />
          </label>
        </section>

        <div className="graphics-editor-actions">
          <button onClick={() => onResetProfile(profileId)}>Reset This Profile</button>
          <button className="danger" onClick={onResetAll}>Reset All Graphics</button>
        </div>
      </div>
    </aside>
  );
}
