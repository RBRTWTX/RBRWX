import type { BasemapId, MapContextState } from '../types/workspace';

interface HiddenMenuProps {
  open: boolean;
  basemap: BasemapId;
  context: MapContextState;
  onClose: () => void;
  onBasemap: (basemap: BasemapId) => void;
  onContext: (key: keyof MapContextState, value: boolean) => void;
  onResetGlobe: () => void;
  onResetWorkspace: () => void;
}

export function HiddenMenu({
  open,
  basemap,
  context,
  onClose,
  onBasemap,
  onContext,
  onResetGlobe,
  onResetWorkspace,
}: HiddenMenuProps) {
  if (!open) return null;
  return (
    <aside className="hidden-menu">
      <div className="hidden-menu-heading">
        <strong>Map & Workspace</strong>
        <button onClick={onClose}>×</button>
      </div>

      <section>
        <span>Basemap</span>
        <div className="segmented">
          {(['standard', 'dark', 'satellite'] as const).map((value) => (
            <button
              key={value}
              className={basemap === value ? 'active' : ''}
              onClick={() => onBasemap(value)}
            >{value}</button>
          ))}
        </div>
      </section>

      <section>
        <span>Shared map context</span>
        {(['cities', 'roads', 'boundaries'] as const).map((key) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={context[key]}
              onChange={(event) => onContext(key, event.currentTarget.checked)}
            />
            {key}
          </label>
        ))}
      </section>

      <section>
        <span>Camera</span>
        <button onClick={onResetGlobe}>Reset Globe to Texas</button>
      </section>

      <section>
        <button
          className="danger"
          onClick={() => {
            if (window.confirm('Create a new empty RBR WX workspace? All scenes in the current workspace will be removed.')) {
              onResetWorkspace();
            }
          }}
        >New Empty Workspace</button>
      </section>
    </aside>
  );
}
