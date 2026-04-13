import PageLayout from "../components/PageLayout";
import { createInitialGameState, getMockLeaderboard } from "../services/mockGameService";

function LeaderboardPage() {
  const leaderboardRows = getMockLeaderboard(createInitialGameState());

  return (
    <PageLayout
      title="Leaderboard"
      description="Mock leaderboard for Phase 3. This page can switch to GraphQL data later."
    >
      <section className="panel">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Level</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardRows.map((row) => (
              <tr key={row.rank}>
                <td>{row.rank}</td>
                <td>{row.player}</td>
                <td>{row.level}</td>
                <td>{row.score}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="todo-note">
          TODO: replace this mock table with the GraphQL leaderboard query when the
          backend save and ranking flow is ready.
        </p>
      </section>
    </PageLayout>
  );
}

export default LeaderboardPage;
