import type { SceneInstance } from '../types/workspace';

type ScenePlayoutPatch = Partial<Pick<SceneInstance, 'transition' | 'holdSeconds' | 'advance'>>;

interface ShowPaneProps {
  scenes: SceneInstance[];
  selectedSceneId: string | null;
  collapsed: boolean;
  playing: boolean;
  onToggleCollapsed: () => void;
  onSelect: (sceneId: string) => void;
  onFirst: () => void;
  onPrevious: () => void;
  onPlay: () => void;
  onNext: () => void;
  onStop: () => void;
  onPlayout: (sceneId: string, patch: ScenePlayoutPatch) => void;
}

function clampHoldSeconds(value: number): number {
  return Math.max(1, Math.min(600, Number.isFinite(value) ? value : 10));
}

function clampTransitionDuration(value: number): number {
  return Math.max(0, Math.min(8000, Number.isFinite(value) ? value : 1800));
}

export function ShowPane({
  scenes,
  selectedSceneId,
  collapsed,
  playing,
  onToggleCollapsed,
  onSelect,
  onFirst,
  onPrevious,
  onPlay,
  onNext,
  onStop,
  onPlayout,
}: ShowPaneProps) {
  const selectedIndex = scenes.findIndex((scene) => scene.id === selectedSceneId);
  const selectedScene = selectedIndex >= 0 ? scenes[selectedIndex] : null;
  const hasScenes = scenes.length > 0;
  const atFirst = selectedIndex <= 0;
  const atLast = selectedIndex < 0 || selectedIndex >= scenes.length - 1;

  return (
    <section className={`show-pane ${collapsed ? 'collapsed' : ''}`}>
      <div className="show-heading">
        <div className="show-heading-summary">
          <span>SHOW</span>
          <strong>{scenes.length} scene{scenes.length === 1 ? '' : 's'}</strong>
          {playing && <b className="show-on-air">ON AIR</b>}
        </div>

        <div className="show-transport" aria-label="Broadcast Engine transport">
          <button type="button" title="First scene" disabled={!hasScenes || atFirst} onClick={onFirst}>|◀</button>
          <button type="button" title="Previous scene" disabled={!hasScenes || atFirst} onClick={onPrevious}>◀</button>
          <button type="button" className={playing ? 'active' : ''} title="Start playout" disabled={!hasScenes || playing} onClick={onPlay}>▶ Play</button>
          <button type="button" title="Next scene" disabled={!hasScenes || atLast} onClick={onNext}>▶</button>
          <button type="button" title="Stop playout" disabled={!playing} onClick={onStop}>■</button>
        </div>

        <button type="button" onClick={onToggleCollapsed}>{collapsed ? 'Show Timeline' : 'Minimize'}</button>
      </div>

      {!collapsed && (
        <>
          {selectedScene && (
            <div className="show-playout-settings" aria-label="Selected scene playout settings">
              <label>
                <span>Transition</span>
                <select
                  value={selectedScene.transition.type}
                  onChange={(event) => onPlayout(selectedScene.id, {
                    transition: {
                      ...selectedScene.transition,
                      type: event.currentTarget.value as SceneInstance['transition']['type'],
                    },
                  })}
                >
                  <option value="fly">Fly</option>
                  <option value="ease">Ease</option>
                  <option value="dissolve">Dissolve</option>
                  <option value="cut">Cut</option>
                </select>
              </label>

              <label className="show-duration-control">
                <span>Duration</span>
                <input
                  type="range"
                  min="0"
                  max="8000"
                  step="100"
                  value={selectedScene.transition.durationMs}
                  onChange={(event) => onPlayout(selectedScene.id, {
                    transition: {
                      ...selectedScene.transition,
                      durationMs: clampTransitionDuration(Number(event.currentTarget.value)),
                    },
                  })}
                />
                <output>{(selectedScene.transition.durationMs / 1000).toFixed(1)}s</output>
              </label>

              <label>
                <span>Hold</span>
                <span className="show-number-control">
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={selectedScene.holdSeconds}
                    onChange={(event) => onPlayout(selectedScene.id, {
                      holdSeconds: clampHoldSeconds(Number(event.currentTarget.value)),
                    })}
                  />
                  <em>s</em>
                </span>
              </label>

              <label>
                <span>Advance</span>
                <select
                  value={selectedScene.advance}
                  onChange={(event) => onPlayout(selectedScene.id, {
                    advance: event.currentTarget.value as SceneInstance['advance'],
                  })}
                >
                  <option value="manual">Manual</option>
                  <option value="automatic">Automatic</option>
                </select>
              </label>
            </div>
          )}

          <div className="show-timeline">
            {scenes.length === 0 ? (
              <div className="show-empty">Scenes added from the Library will appear here in the same order.</div>
            ) : scenes.map((scene, index) => {
              const active = selectedSceneId === scene.id;
              const onAir = playing && active;
              return (
                <button
                  type="button"
                  key={scene.id}
                  className={`${active ? 'active' : ''} ${onAir ? 'on-air' : ''}`.trim()}
                  onClick={() => onSelect(scene.id)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{scene.name}</strong>
                  <small>{scene.dataState.toUpperCase()}</small>
                </button>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
