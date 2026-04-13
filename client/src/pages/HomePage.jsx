import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function HomePage() {
  return (
    <PageLayout
      title="Docker Heist"
      description="Starter shell for a Docker-themed web game. Gameplay is intentionally not implemented in Phase 1."
    >
      <section className="card-grid">
        <article className="panel">
          <h2>Project Status</h2>
          <p>
            React routes, GraphQL wiring, MongoDB models, and JWT auth scaffolding
            are ready for the next phase.
          </p>
        </article>

        <article className="panel">
          <h2>Phase 1 Scope</h2>
          <p>
            Use this phase to demonstrate architecture, API structure, and the
            assignment-aligned data model.
          </p>
        </article>

        <article className="panel">
          <h2>Next Step</h2>
          <p>
            Implement one playable Docker-themed gameplay loop in the Game page
            using Three.js.
          </p>
        </article>
      </section>

      <section className="callout">
        <p>Starter routes are available now.</p>
        <div className="button-row">
          <Link className="button" to="/register">
            Create Account
          </Link>
          <Link className="button button-secondary" to="/dashboard">
            View Dashboard
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

export default HomePage;
