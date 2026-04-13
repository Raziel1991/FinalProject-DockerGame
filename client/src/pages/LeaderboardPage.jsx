import PageLayout from "../components/PageLayout";

const placeholderRows = [
  { rank: 1, player: "stackCaptain", score: 2280 },
  { rank: 2, player: "portMapper", score: 1975 },
  { rank: 3, player: "yamlWizard", score: 1840 }
];

function LeaderboardPage() {
  return (
    <PageLayout
      title="Leaderboard"
      description="Presentation-friendly leaderboard stub using placeholder data."
    >
      <section className="panel">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {placeholderRows.map((row) => (
              <tr key={row.rank}>
                <td>{row.rank}</td>
                <td>{row.player}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="todo-note">
          TODO: query live leaderboard entries from GraphQL and sort them by score.
        </p>
      </section>
    </PageLayout>
  );
}

export default LeaderboardPage;
