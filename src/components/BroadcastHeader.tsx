import type { HeaderDefinition, LegendDefinition } from '../types/workspace';

interface BroadcastHeaderProps {
  header: HeaderDefinition | null;
  legend: LegendDefinition;
}

export function BroadcastHeader({ header, legend }: BroadcastHeaderProps) {
  if (!header) return null;
  return (
    <>
      <header className="broadcast-header">
        <div>
          <strong>{header.title}</strong>
          <span>{header.subtitle}</span>
        </div>
        <span>{header.validLabel}</span>
      </header>
      {legend.kind !== 'none' && (
        <div className="broadcast-legend" data-kind={legend.kind}>
          <strong>{legend.label ?? legend.kind.replace(/-/g, ' ').toUpperCase()}</strong>
        </div>
      )}
    </>
  );
}
