export function AppHeader() {
  return (
    <nav className="nav" aria-label="Điều hướng chính">
      <div className="nav__inner">
        <a className="logo" href="/" aria-label="Cipher IO">
          CIPHER<span>.</span>IO
        </a>
        <span className="nav__label">Cipher tools</span>
      </div>
    </nav>
  );
}
