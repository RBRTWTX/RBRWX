import type { SceneInstance } from '../types/workspace';

interface ScenePaneProps {
  scenes: SceneInstance[];
  selectedSceneId: string | null;
  onOpenLibrary: () => void;
  onSelect: (sceneId: string) => void;
  onRemove: (sceneId: string) => void;
  onMove: (sceneId: string, direction: -1 | 1) => void;
}

export function ScenePane({
  scenes,
  selectedSceneId,
  onOpenLibrary,
  onSelect,
  onRemove,
  onMove,
}: ScenePaneProps) {
  return (
    <aside className="scene-pane">
      <div className="pane-heading">
        <div>
          <span>WORKSPACE</span>
          <h2>Scenes</h2>
        </div>
        <button onClick={onOpenLibrary}>+ Scene</button>
      </div>

      {scenes.length === 0 ? (
        <div className="empty-scenes">
          <strong>No scenes added</strong>
          <span>Use the Library to add a requested weather scene.</span>
        </div>
      ) : (
        <div className="scene-list">
          {scenes.map((scene, index) => (
            <article
              key={scene.id}
              className={`scene-card ${selectedSceneId === scene.id ? 'selected' : ''}`}
              onClick={() => onSelect(scene.id)}
            >
              <div className="scene-card-main">
                <strong>{scene.name}</strong>
                <span>{scene.group}</span>
                <small>{scene.dataMessage}</small>
              </div>
              <span className={`data-state state-${scene.dataState}`}>{scene.dataState.toUpperCase()}</span>
              <div className="scene-card-actions">
                <button
                  disabled={index === 0}
                  onClick={(event) => { event.stopPropagation(); onMove(scene.id, -1); }}
                  aria-label={`Move ${scene.name} earlier`}
                >↑</button>
                <button
                  disabled={index === scenes.length - 1}
                  onClick={(event) => { event.stopPropagation(); onMove(scene.id, 1); }}
                  aria-label={`Move ${scene.name} later`}
                >↓</button>
                <button
                  onClick={(event) => { event.stopPropagation(); onRemove(scene.id); }}
                  aria-label={`Remove ${scene.name}`}
                >×</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </aside>
  );
}
