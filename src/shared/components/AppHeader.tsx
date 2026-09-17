interface AppHeaderProps {
  disabled: boolean;
  onReset: () => void;
}

export function AppHeader({ disabled, onReset }: AppHeaderProps) {
  return (
    <nav className="nav" aria-label="Điều hướng chính">
      <div className="nav__inner">
        <a className="logo" href="/" aria-label="Cipher Workbench">
          CIPHER WORKBENCH
        </a>
        <div className="nav__actions">
          <button className="refresh-button" type="button" onClick={onReset} disabled={disabled}>
            <span aria-hidden="true">↻</span>
            Làm mới
          </button>
        </div>
      </div>
    </nav>
  );
}
