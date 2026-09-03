import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  PropsWithChildren,
} from 'react';
import type { BroadcastGraphicGeometry } from '../graphics/types';

interface BroadcastGraphicFrameProps extends PropsWithChildren {
  graphicId: string;
  className: string;
  geometry: BroadcastGraphicGeometry;
  interactive: boolean;
  minWidth?: number;
  minHeight?: number;
  selected?: boolean;
  onSelect?: (graphicId: string) => void;
  onGeometry?: (graphicId: string, geometry: BroadcastGraphicGeometry) => void;
  onRemove?: () => void;
  removeLabel?: string;
  title?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isEditableTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && Boolean(target.closest('[contenteditable="true"], .broadcast-graphic-resize-handle, .broadcast-graphic-remove-handle'));
}

export function BroadcastGraphicFrame({
  graphicId,
  className,
  geometry,
  interactive,
  minWidth = 18,
  minHeight = 26,
  selected = false,
  onSelect,
  onGeometry,
  onRemove,
  removeLabel,
  title,
  children,
}: BroadcastGraphicFrameProps) {
  const style = {
    left: `${geometry.x}%`,
    top: `${geometry.y}%`,
    width: `${geometry.width}%`,
    height: `${geometry.height}px`,
  } as CSSProperties;

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!interactive || event.button !== 0) return;

    onSelect?.(graphicId);
    if (!onGeometry || isEditableTarget(event.target)) return;

    const layer = event.currentTarget.parentElement;
    if (!layer) return;
    const rect = layer.getBoundingClientRect();
    const startX = geometry.x;
    const startY = geometry.y;
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    const maxX = Math.max(0, 100 - geometry.width);
    const heightPct = geometry.height / Math.max(rect.height, 1) * 100;
    const maxY = Math.max(0, 100 - heightPct);

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const dx = (moveEvent.clientX - pointerX) / Math.max(rect.width, 1) * 100;
      const dy = (moveEvent.clientY - pointerY) / Math.max(rect.height, 1) * 100;
      onSelect?.(graphicId);
      onGeometry(graphicId, {
        ...geometry,
        x: clamp(startX + dx, 0, maxX),
        y: clamp(startY + dy, 0, maxY),
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

  function beginResize(event: ReactPointerEvent<HTMLButtonElement>): void {
    if (!interactive || !onGeometry || event.button !== 0) return;

    onSelect?.(graphicId);
    const frame = event.currentTarget.parentElement;
    const layer = frame?.parentElement;
    if (!frame || !layer) return;

    const rect = layer.getBoundingClientRect();
    const startWidth = geometry.width;
    const startHeight = geometry.height;
    const pointerX = event.clientX;
    const pointerY = event.clientY;
    const maxWidth = Math.max(minWidth, 100 - geometry.x);
    const topPx = rect.height * geometry.y / 100;
    const maxHeight = Math.max(minHeight, rect.height - topPx);

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      const widthDelta = (moveEvent.clientX - pointerX) / Math.max(rect.width, 1) * 100;
      const heightDelta = moveEvent.clientY - pointerY;
      onSelect?.(graphicId);
      onGeometry(graphicId, {
        ...geometry,
        width: clamp(startWidth + widthDelta, minWidth, maxWidth),
        height: clamp(startHeight + heightDelta, minHeight, maxHeight),
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
      className={`broadcast-graphic-frame ${interactive ? 'is-interactive' : ''} ${className}`.trim()}
      style={style}
      data-broadcast-graphic-id={graphicId}
      onPointerDown={beginDrag}
      title={interactive ? title ?? 'Drag to move. Drag the corner handle to resize.' : undefined}
    >
      {children}
      {interactive && selected && onRemove && (
        <button
          type="button"
          className="broadcast-graphic-remove-handle"
          aria-label={removeLabel ?? `Remove ${graphicId}`}
          title={removeLabel ?? `Remove ${graphicId}`}
          onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); }}
          onClick={(event) => { event.preventDefault(); event.stopPropagation(); onRemove(); }}
        >×</button>
      )}
      {interactive && selected && (
        <button
          type="button"
          className="broadcast-graphic-resize-handle"
          aria-label={`Resize ${graphicId}`}
          title={`Resize ${graphicId}`}
          onPointerDown={beginResize}
        />
      )}
    </div>
  );
}
