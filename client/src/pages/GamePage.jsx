import PageLayout from "../components/PageLayout";

function GamePage() {
  return (
    <PageLayout
      title="Game"
      description="This page will host the Three.js scene later. For now it is only a gameplay placeholder."
    >
      <section className="panel">
        <div className="game-placeholder">
          <span>Three.js canvas placeholder</span>
        </div>

        <p className="todo-note">
          TODO: mount the actual scene here and implement the first playable
          Docker-themed mission loop.
        </p>

        <ul>
          <li>Possible mission: route images to the correct containers under time pressure.</li>
          <li>Possible reward: XP, credits, and an achievement unlock.</li>
          <li>Possible failure condition: service crash from incorrect container mapping.</li>
        </ul>
      </section>
    </PageLayout>
  );
}

export default GamePage;
