interface TopBarProps {
  sceneName: string;
  onLibrary: () => void;
  onGraphics: () => void;
  onPresent: () => void;
  onExport: () => void;
  onMenu: () => void;
}

export function TopBar({ sceneName, onLibrary, onGraphics, onPresent, onExport, onMenu }: TopBarProps) {
  return (
    <header className="top-bar">
      <div className="brand">
        <strong>RBR WX</strong>
        <span>{sceneName}</span>
      </div>
      <div className="top-actions">
        <button onClick={onLibrary}>Library</button>
        <button onClick={onGraphics}>Graphics</button>
        <button onClick={onPresent}>Present</button>
        <button onClick={onExport}>Export PNG</button>
        <button onClick={onMenu}>Menu</button>
      </div>
    </header>
  );
}
