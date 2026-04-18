import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { getLeaderboard } from "../graphql/gameApi";

function LeaderboardPage() {
  const [leaderboardRows, setLeaderboardRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      const rows = await getLeaderboard();
      setLeaderboardRows(rows);
      setIsLoading(false);
    }

    loadLeaderboard();
  }, []);

  return (
    <PageLayout
      title="Leaderboard"
      description="Live leaderboard data from GraphQL and MongoDB, sorted by score."
    >
      <section className="panel">
        {isLoading ? (
          <p className="todo-note">Loading leaderboard...</p>
        ) : leaderboardRows.length === 0 ? (
          <div>
            <h2>No Scores Yet</h2>
            <p className="todo-note">
              No leaderboard entries have been saved yet. Play a session and save
              progress to create the first ranking.
            </p>
          </div>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Level</th>
                <th>XP</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardRows.map((row) => (
                <tr key={`${row.rank}-${row.player}`}>
                  <td>{row.rank}</td>
                  <td>{row.player}</td>
                  <td>{row.score}</td>
                  <td>{row.level ?? "-"}</td>
                  <td>{row.xp ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </PageLayout>
  );
}

export default LeaderboardPage;
