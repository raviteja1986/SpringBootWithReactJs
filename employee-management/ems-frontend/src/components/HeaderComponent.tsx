import { Link } from "react-router-dom";
export function HeaderComponent() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/employees" className="brand">
          <span className="brand-mark">T</span>
          <span>
            Team<span className="brand-light">space</span>
          </span>
        </Link>
        <nav>
          <Link to="/employees" className="nav-link">
            Directory
          </Link>
          <span className="header-divider" />
          <span className="profile-avatar" aria-label="Your profile">
            JD
          </span>
        </nav>
      </div>
    </header>
  );
}
