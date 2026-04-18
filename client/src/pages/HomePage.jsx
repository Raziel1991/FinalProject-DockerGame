import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

function HomePage() {
  return (
    <PageLayout
      title="Docker Heist"
      description="Docker-themed web game with authentication, GraphQL progress tracking, achievements, challenges, and leaderboard support."
    >
      <section className="card-grid">
        <article className="panel">
          <h2>Project Status</h2>
          <p>
            The app now includes real login, registration, protected routes, progress
            saving, dashboard data, and a live leaderboard.
          </p>
        </article>

        <article className="panel">
          <h2>Core Features</h2>
          <p>
            Play the mock Docker mission, save progress to MongoDB, unlock achievements,
            and compare scores on the leaderboard.
          </p>
        </article>

        <article className="panel">
          <h2>Presentation Ready</h2>
          <p>
            Development demo accounts and seeded presentation data are available for
            faster testing during class demos.
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
