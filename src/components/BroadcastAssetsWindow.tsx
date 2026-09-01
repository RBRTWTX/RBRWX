import { useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react';
import {
  BROADCAST_ASSET_CATALOG,
  BROADCAST_ASSET_CATEGORIES,
  broadcastAssetDefinition,
  type BroadcastAssetCategoryId,
} from '../graphics/broadcast-asset-catalog';
import type { BroadcastGraphicsState } from '../graphics/types';
import type { BroadcastGraphicsSettingsPatch } from '../types/workspace';
import { BroadcastAssetArtwork } from './BroadcastAssetArtwork';

interface BroadcastAssetsWindowProps {
  open: boolean;
  graphics: BroadcastGraphicsState;
  onClose: () => void;
  onSettings: (patch: BroadcastGraphicsSettingsPatch) => void;
}

type LibraryView = BroadcastAssetCategoryId | 'uploaded';

function nextPlacement(index: number) {
  const offset = (index % 6) * 2;
  return { x: 40 + offset, y: 38 + offset, width: 12, height: 96 };
}

export function BroadcastAssetsWindow({ open, graphics, onClose, onSettings }: BroadcastAssetsWindowProps) {
  const [view, setView] = useState<LibraryView>('alert-warning-watch-advisory');
  const [position, setPosition] = useState({ x: 360, y: 86 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dragRef = useRef<{ pointerId: number; offsetX: number; offsetY: number } | null>(null);

  const visibleAssets = useMemo(
    () => view === 'uploaded' ? [] : BROADCAST_ASSET_CATALOG.filter((asset) => asset.category === view),
    [view],
  );

  if (!open) return null;

  function startWindowDrag(event: ReactPointerEvent<HTMLElement>): void {
    if ((event.target as HTMLElement).closest('button,input')) return;
    const rect = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;
    dragRef.current = { pointerId: event.pointerId, offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveWindow(event: ReactPointerEvent<HTMLElement>): void {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const width = 760;
    const height = 560;
    const x = Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - drag.offsetX));
    const y = Math.max(54, Math.min(window.innerHeight - height - 8, event.clientY - drag.offsetY));
    setPosition({ x, y });
  }

  function stopWindowDrag(event: ReactPointerEvent<HTMLElement>): void {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function addBuiltIn(assetId: string): void {
    const asset = broadcastAssetDefinition(assetId);
    if (!asset) return;
    const instance = {
      id: `asset-${crypto.randomUUID()}`,
      source: 'builtin' as const,
      assetId,
      geometry: nextPlacement(graphics.placedAssets.length),
    };
    onSettings({ placedAssets: [...graphics.placedAssets, instance] });
  }

  function addUploaded(customAssetId: string): void {
    if (!graphics.customAssets.some((asset) => asset.id === customAssetId)) return;
    const instance = {
      id: `asset-${crypto.randomUUID()}`,
      source: 'custom' as const,
      assetId: customAssetId,
      geometry: nextPlacement(graphics.placedAssets.length),
    };
    onSettings({ placedAssets: [...graphics.placedAssets, instance] });
  }

  function upload(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') return;
      const custom = { id: `custom-${crypto.randomUUID()}`, name: file.name, dataUrl: reader.result };
      onSettings({ customAssets: [...graphics.customAssets, custom] });
      setView('uploaded');
    };
    reader.readAsDataURL(file);
  }

  return (
    <section
      className="broadcast-assets-window"
      style={{ left: position.x, top: position.y }}
      role="dialog"
      aria-modal="false"
      aria-label="Broadcast Assets"
      data-operator-only="true"
    >
      <header
        className="broadcast-assets-window__header"
        onPointerDown={startWindowDrag}
        onPointerMove={moveWindow}
        onPointerUp={stopWindowDrag}
        onPointerCancel={stopWindowDrag}
      >
        <div>
          <span>BROADCAST GRAPHICS</span>
          <h2>Assets</h2>
        </div>
        <button type="button" className="broadcast-assets-window__close" onClick={onClose} aria-label="Close Assets">×</button>
      </header>

      <div className="broadcast-assets-window__body">
        <nav className="broadcast-assets-categories" aria-label="Asset categories">
          {BROADCAST_ASSET_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={view === category.id ? 'is-active' : ''}
              onClick={() => setView(category.id)}
            >
              {category.name}
            </button>
          ))}
          <button type="button" className={view === 'uploaded' ? 'is-active' : ''} onClick={() => setView('uploaded')}>
            Uploaded Images
          </button>
        </nav>

        <div className="broadcast-assets-library">
          <div className="broadcast-assets-library__toolbar">
            <strong>{view === 'uploaded' ? 'Uploaded Images' : BROADCAST_ASSET_CATEGORIES.find((category) => category.id === view)?.name}</strong>
            <button type="button" onClick={() => fileInputRef.current?.click()}>Upload own image to library</button>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={upload} />
          </div>

          <div className="broadcast-assets-grid">
            {view !== 'uploaded' && visibleAssets.map((asset) => (
              <article className="broadcast-asset-card" key={asset.id}>
                <BroadcastAssetArtwork artworkKey={asset.artworkKey} label={asset.name} className="broadcast-asset-card__art" />
                <strong>{asset.name}</strong>
                <button type="button" onClick={() => addBuiltIn(asset.id)}>Add</button>
              </article>
            ))}

            {view === 'uploaded' && graphics.customAssets.map((asset) => (
              <article className="broadcast-asset-card" key={asset.id}>
                <BroadcastAssetArtwork customDataUrl={asset.dataUrl} label={asset.name} className="broadcast-asset-card__art" />
                <strong title={asset.name}>{asset.name}</strong>
                <button type="button" onClick={() => addUploaded(asset.id)}>Add</button>
              </article>
            ))}

            {view === 'uploaded' && graphics.customAssets.length === 0 && (
              <div className="broadcast-assets-empty">No uploaded images in this session.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
