import { PRODUCT_GROUPS, PRODUCT_LIBRARY } from '../catalog/product-library';
import type { ProductDefinition } from '../types/workspace';

interface ProductLibraryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (definition: ProductDefinition) => void;
}

export function ProductLibraryDialog({ open, onClose, onAdd }: ProductLibraryDialogProps) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="library-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog-heading">
          <div>
            <span>RBR WX</span>
            <h2>Scene Library</h2>
          </div>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="library-groups">
          {PRODUCT_GROUPS.map((group) => (
            <section className="library-group" key={group}>
              <h3>{group}</h3>
              <div className="library-products">
                {PRODUCT_LIBRARY.filter((item) => item.group === group).map((definition) => (
                  <article key={definition.id}>
                    <div>
                      <strong>{definition.name}</strong>
                      <span>{definition.providerFamily}</span>
                    </div>
                    <button
                      disabled={definition.availability !== 'available'}
                      onClick={() => onAdd(definition)}
                    >
                      {definition.availability === 'available' ? 'Add' : 'Port Pending'}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
