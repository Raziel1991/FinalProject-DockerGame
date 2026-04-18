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
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">COMP-308 Phase 1</p>
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
        </div>

        <nav className="site-nav">
          <Link to="/">Home</Link>
          {!isAuthenticated ? <Link to="/login">Login</Link> : null}
          {!isAuthenticated ? <Link to="/register">Register</Link> : null}
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/game">Game</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
          {isAuthenticated ? (
            <button type="button" className="button" onClick={handleLogout}>
              Logout
            </button>
          ) : null}
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}

export default PageLayout;
