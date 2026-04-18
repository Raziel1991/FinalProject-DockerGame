import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import { getDashboardData } from "../graphql/gameApi";

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const data = await getDashboardData();
      setDashboard(data);
      setIsLoading(false);
    }

    loadDashboard();
  }, []);

  const stats = dashboard?.profile
    ? [
        { label: "Level", value: String(dashboard.profile.level) },
        { label: "XP", value: String(dashboard.profile.xp) },
        { label: "Credits", value: String(dashboard.profile.credits) },
        { label: "Current Stage", value: dashboard.profile.currentStage }
      ]
    : [];

  return (
    <PageLayout
      title="Dashboard"
      description="Live player dashboard with progress, achievements, recent matches, and active challenges."
    >
      {isLoading ? (
        <section className="panel">
          <p className="todo-note">Loading dashboard...</p>
        </section>
      ) : (
        <>
          <section className="card-grid">
            {stats.map((stat) => (
              <article className="panel stat-card" key={stat.label}>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
              </article>
            ))}
          </section>

          <section className="card-grid">
            <article className="panel">
              <h2>Mission Status</h2>
              <p>Status: {dashboard?.profile?.missionStatus || "Standby"}</p>
              <p>Progress: {dashboard?.profile?.missionProgress ?? 0}%</p>
              <p>Container Health: {dashboard?.profile?.containerHealth ?? 0}%</p>
            </article>

            <article className="panel">
              <h2>Recent Match</h2>
              {dashboard?.recentMatches?.length ? (
                <>
                  <p>Result: {dashboard.recentMatches[0].result}</p>
                  <p>Score Earned: {dashboard.recentMatches[0].scoreEarned}</p>
                  <p>XP Earned: {dashboard.recentMatches[0].xpEarned}</p>
                </>
              ) : (
                <p className="todo-note">No recent match results yet.</p>
              )}
            </article>
          </section>

          <section className="card-grid">
            <article className="panel">
              <h2>Achievements</h2>
              {dashboard?.achievements?.length ? (
                <ul>
                  {dashboard.achievements.map((achievement) => (
                    <li key={achievement.id}>
                      {achievement.title} - {achievement.completed ? "Unlocked" : "Locked"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="todo-note">No achievements yet.</p>
              )}
            </article>

            <article className="panel">
              <h2>Active Challenges</h2>
              {dashboard?.activeChallenges?.length ? (
                <ul>
                  {dashboard.activeChallenges.map((challenge) => (
                    <li key={challenge.id}>
                      {challenge.title} - {challenge.rewardXp} XP / {challenge.rewardCredits} credits
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="todo-note">No active challenges available.</p>
              )}
            </article>
          </section>
        </>
      )}
    </PageLayout>
  );
}

export default DashboardPage;
