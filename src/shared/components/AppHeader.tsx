export function AppHeader() {
  return (
    <nav className="nav" aria-label="Điều hướng chính">
      <div className="nav__inner">
        <a className="logo" href="/" aria-label="Cipher Workbench">
          CIPHER WORKBENCH
        </a>
        <div className="nav__actions">
          <button className="refresh-button" type="button" onClick={() => window.location.reload()}>
            <span aria-hidden="true">↻</span>
            Làm mới
          </button>
        </div>
      </div>
    </nav>
  );
}
