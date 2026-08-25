import type { SceneInstance } from '../types/workspace';

interface ShowPaneProps {
  scenes: SceneInstance[];
  selectedSceneId: string | null;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSelect: (sceneId: string) => void;
}

export function ShowPane({
  scenes,
  selectedSceneId,
  collapsed,
  onToggleCollapsed,
  onSelect,
}: ShowPaneProps) {
  return (
    <section className={`show-pane ${collapsed ? 'collapsed' : ''}`}>
      <div className="show-heading">
        <div>
          <span>SHOW</span>
          <strong>{scenes.length} scene{scenes.length === 1 ? '' : 's'}</strong>
        </div>
        <button onClick={onToggleCollapsed}>{collapsed ? 'Show Timeline' : 'Minimize'}</button>
      </div>
      {!collapsed && (
        <div className="show-timeline">
          {scenes.length === 0 ? (
            <div className="show-empty">Scenes added from the Library will appear here in the same order.</div>
          ) : scenes.map((scene, index) => (
            <button
              key={scene.id}
              className={selectedSceneId === scene.id ? 'active' : ''}
              onClick={() => onSelect(scene.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{scene.name}</strong>
              <small>{scene.dataState.toUpperCase()}</small>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
