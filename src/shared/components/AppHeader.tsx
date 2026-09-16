export function AppHeader() {
  return (
    <nav className="nav" aria-label="Điều hướng chính">
      <div className="nav__inner">
        <a className="logo" href="/" aria-label="Cipher IO">
          CIPHER<span>.</span>IO
        </a>
        <div className="nav__actions">
          <span className="nav__label">Cipher tools</span>
          <button className="refresh-button" type="button" onClick={() => window.location.reload()}>
            <span aria-hidden="true">↻</span>
            Làm mới
          </button>
        </div>
      </div>
    </nav>
  );
}
