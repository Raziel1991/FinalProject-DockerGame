import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function HomePage() {
  return (
    <PageLayout
      title="Docker Heist"
      description="A dark, Docker-themed web game where players stabilize a container fleet, beat AI challenges, and persist progress through GraphQL and MongoDB."
    >
      <section className="home-hero-grid">
        <div className="home-copy">
          <p className="eyebrow">Interactive Web Game</p>
          <h2>Control the fleet before the containers collapse.</h2>
          <p>
            Run Docker-style commands, recover crashed services, complete AI challenge
            runs, and watch your score climb across the leaderboard.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to="/game">
              Launch Game
            </Link>
            <Link className="button button-secondary" to="/dashboard">
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="command-preview" aria-label="Docker Heist command preview">
          <div className="preview-toolbar">
            <span />
            <span />
            <span />
          </div>
          <div className="terminal-lines">
            <p><span>$</span> docker ps --fleet whale-ops</p>
            <p><span>&gt;</span> 14 containers detected</p>
            <p><span>&gt;</span> 03 services unstable</p>
            <p><span>$</span> docker restart container-08</p>
            <p><span>&gt;</span> health restored +6%</p>
            <p><span>$</span> submit adaptive-sentinel-duel</p>
          </div>
          <div className="preview-grid">
            <div><strong>XP</strong><span>+220</span></div>
            <div><strong>Credits</strong><span>+120</span></div>
            <div><strong>Rank</strong><span>#1</span></div>
          </div>
        </div>
      </section>

      <section className="feature-strip">
        <article>
          <span>01</span>
          <h2>Authenticate</h2>
          <p>JWT registration, login, protected routes, and profile data.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Play</h2>
          <p>Three.js containers, Docker commands, health, score, and game over.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Progress</h2>
          <p>MongoDB-backed XP, credits, achievements, matches, and leaderboard.</p>
        </article>
        <article>
          <span>04</span>
          <h2>Challenge</h2>
          <p>Async AI opponent flow with backend event updates.</p>
        </article>
      </section>
    </PageLayout>
  );
}

export default HomePage;
