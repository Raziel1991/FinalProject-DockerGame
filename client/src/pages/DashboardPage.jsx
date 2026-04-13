import PageLayout from "../components/PageLayout";

const placeholderStats = [
  { label: "Level", value: "3" },
  { label: "XP", value: "420" },
  { label: "Credits", value: "180" },
  { label: "Current Stage", value: "Dock-01" }
];

function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      description="Starter dashboard for player progression, achievements, and active challenges."
    >
      <section className="card-grid">
        {placeholderStats.map((stat) => (
          <article className="panel stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2>Assignments for Phase 2</h2>
        <ul>
          <li>Load the authenticated user's profile from GraphQL.</li>
          <li>Display achievements, match history, and active challenges.</li>
          <li>Persist score and progression updates after gameplay.</li>
        </ul>
      </section>
    </PageLayout>
  );
}

export default DashboardPage;
