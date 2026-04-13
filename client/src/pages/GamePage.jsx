import PageLayout from "../components/PageLayout";
import GameScenePlaceholder from "../components/GameScenePlaceholder";

function GamePage() {
  const hudStats = [
    { label: "Score", value: "1250" },
    { label: "XP", value: "340" },
    { label: "Container Health", value: "84%" },
    { label: "Mission State", value: "Standby" }
  ];

  const missionSteps = [
    "Scan the container yard",
    "Match cargo to the correct image",
    "Stabilize damaged services",
    "Extract before system timeout"
  ];

  return (
    <PageLayout
      title="Game"
      description="Phase 2 game shell with a Three.js placeholder scene, mock HUD data, and mission status panels."
    >
      <section className="card-grid">
        {hudStats.map((stat) => (
          <article className="panel stat-card hud-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="game-layout">
        <div className="game-main-column">
          <section className="panel">
            <GameScenePlaceholder />
          </section>

          <section className="panel">
            <h2>Mission Notes</h2>
            <p className="todo-note">
              This screen is a shell for the future gameplay loop. State values are
              mock data only for layout and presentation.
            </p>
            <ul>
              <li>Scene rendering is active with Three.js.</li>
              <li>No scoring logic, collisions, or task system are active yet.</li>
              <li>Phase 3 should connect actions to score, XP, and progress updates.</li>
            </ul>
          </section>
        </div>

        <aside className="game-side-column">
          <section className="panel">
            <h2>HUD</h2>
            <div className="hud-list">
              <div className="hud-row">
                <span>Current Mission</span>
                <strong>Container Recovery</strong>
              </div>
              <div className="hud-row">
                <span>Alert Level</span>
                <strong>Low</strong>
              </div>
              <div className="hud-row">
                <span>Time Left</span>
                <strong>02:45</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Mission Flow</h2>
            <ol className="mission-list">
              {missionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="panel">
            <h2>Next Work</h2>
            <p className="todo-note">
              TODO: replace mock values with real local state and connect the scene
              to one simple playable mission.
            </p>
          </section>
        </aside>
      </section>
    </PageLayout>
  );
}

export default GamePage;
