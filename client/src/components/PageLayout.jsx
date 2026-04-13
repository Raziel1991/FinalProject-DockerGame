import { Link } from "react-router-dom";

function PageLayout({ title, description, children }) {
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
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/game">Game</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}

export default PageLayout;
