import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PageLayout({ title, description, children }) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-frame">
      <header className="topbar">
        <Link to="/" className="brand-mark">
          <span className="brand-icon">DH</span>
          <span>
            <strong>Docker Heist</strong>
            <small>COMP-308 Exercise 2</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <Link to="/game">Game</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
          {!isAuthenticated ? <Link to="/login">Login</Link> : null}
          {!isAuthenticated ? <Link to="/register">Register</Link> : null}
          {isAuthenticated ? (
            <button type="button" className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </nav>
      </header>

      <div className="app-shell">
        <section className="page-hero">
          <div>
            <p className="eyebrow">Docker Ops Simulation</p>
            <h1>{title}</h1>
            <p className="page-description">{description}</p>
          </div>
          <div className="hero-status" aria-label="Project status">
            <span>GraphQL</span>
            <strong>Online</strong>
          </div>
        </section>

        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}

export default PageLayout;
