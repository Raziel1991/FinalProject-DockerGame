import { useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import GameScenePlaceholder from "../components/GameScenePlaceholder";
import {
  applyMockAction,
  createInitialGameState,
  getMockMissionSteps
} from "../services/mockGameService";

function GamePage() {
  const [gameState, setGameState] = useState(() => createInitialGameState());

  const primaryStats = useMemo(
    () => [
      { label: "Score", value: String(gameState.score) },
      { label: "XP", value: String(gameState.xp) },
      { label: "Level", value: String(gameState.level) },
      { label: "Container Health", value: `${gameState.containerHealth}%` }
    ],
    [gameState]
  );

  const missionSteps = getMockMissionSteps();
  const secondaryStats = [
    { label: "Mission State", value: gameState.missionStatus },
    { label: "Progress", value: `${gameState.missionProgress}%` }
  ];

  function handleAction(actionKey) {
    setGameState((currentState) => applyMockAction(currentState, actionKey));
  }

  return (
    <PageLayout
      title="Game"
      description="Phase 3 mock gameplay shell with simple actions, mission progress, and achievement tracking."
    >
      <section className="card-grid">
        {primaryStats.map((stat) => (
          <article className="panel stat-card hud-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}

        {secondaryStats.map((stat) => (
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
            <h2>Action Panel</h2>
            <div className="action-grid">
              <button type="button" className="button" onClick={() => handleAction("buildImage")}>
                Build Image
              </button>
              <button
                type="button"
                className="button"
                onClick={() => handleAction("startContainer")}
              >
                Start Container
              </button>
              <button
                type="button"
                className="button"
                onClick={() => handleAction("restartService")}
              >
                Restart Service
              </button>
              <button type="button" className="button" onClick={() => handleAction("patchLeak")}>
                Patch Leak
              </button>
            </div>

            <p className="todo-note">
              These buttons use simple mock rules. They are here to show progress
              flow, not final gameplay mechanics.
            </p>
          </section>

          <section className="panel">
            <h2>Mission Notes</h2>
            <p className="todo-note">
              This screen now uses local mock state. It still does not include final
              Docker game rules, balancing, or win conditions.
            </p>
            <ul>
              <li>Scene rendering is active with Three.js.</li>
              <li>Buttons update score, XP, health, and mission progress in a fixed way.</li>
              <li>Later phases should replace this with real gameplay events and backend saves.</li>
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
                <strong>{gameState.containerHealth >= 80 ? "Low" : "Medium"}</strong>
              </div>
              <div className="hud-row">
                <span>Mission State</span>
                <strong>{gameState.missionStatus}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Mission Flow</h2>
            <ol className="mission-list">
              {missionSteps.map((step, index) => (
                <li
                  key={step}
                  className={index < gameState.missionIndex ? "mission-step-complete" : ""}
                >
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="panel">
            <h2>Achievements</h2>
            <div className="achievement-list">
              {gameState.achievements.map((achievement) => (
                <div className="achievement-card" key={achievement.key}>
                  <div>
                    <strong>{achievement.title}</strong>
                    <p>{achievement.description}</p>
                  </div>
                  <span
                    className={
                      achievement.unlocked
                        ? "achievement-badge achievement-unlocked"
                        : "achievement-badge"
                    }
                  >
                    {achievement.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2>Recent Match Result</h2>
            <div className="hud-list">
              <div className="hud-row">
                <span>Status</span>
                <strong>{gameState.recentMatchResult.result}</strong>
              </div>
              <div className="hud-row">
                <span>Score Earned</span>
                <strong>{gameState.recentMatchResult.scoreEarned}</strong>
              </div>
              <div className="hud-row">
                <span>XP Earned</span>
                <strong>{gameState.recentMatchResult.xpEarned}</strong>
              </div>
            </div>
            <p className="todo-note">{gameState.recentMatchResult.summary}</p>
          </section>

          <section className="panel">
            <h2>Next Work</h2>
            <p className="todo-note">
              TODO: replace these mock actions with real scene events, mission rules,
              and backend save logic.
            </p>
          </section>
        </aside>
      </section>
    </PageLayout>
  );
}

export default GamePage;
