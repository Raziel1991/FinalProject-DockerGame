import { useCallback, useEffect, useMemo, useState } from "react";
import PageLayout from "../components/PageLayout";
import GameScenePlaceholder from "../components/GameScenePlaceholder";
import {
  completeChallenge,
  getAchievements,
  getChallenges,
  getCurrentUser,
  getLiveGameEvents,
  saveGameProgress
} from "../graphql/gameApi";

function buildAchievementList(score, health, commandCounts) {
  return [
    {
      key: "first-commit",
      title: "First Commit",
      description: "Use docker commit one time.",
      unlocked: commandCounts.commit >= 1
    },
    {
      key: "crash-manager",
      title: "Crash Manager",
      description: "Restart a crashed container.",
      unlocked: commandCounts.restart >= 1
    },
    {
      key: "fleet-captain",
      title: "Fleet Captain",
      description: "Reach 300 throughput in one run.",
      unlocked: score >= 300
    },
    {
      key: "steady-ops",
      title: "Steady Ops",
      description: "Keep fleet health above 80.",
      unlocked: health >= 80
    }
  ];
}

function getHealthLabel(health) {
  if (health > 60) {
    return "Stable";
  }

  if (health > 30) {
    return "Warning";
  }

  return "Critical";
}

function buildSavePayload(score, health, xp, level) {
  return {
    score,
    xp,
    level,
    containerHealth: health,
    missionProgress: Math.min(100, Math.round(score / 5)),
    missionStatus: health > 0 ? "Fleet Active" : "Fleet Sunk",
    recentMatchResult: {
      result: health > 0 ? "Mission active" : "Mission failed",
      scoreEarned: score,
      xpEarned: xp,
      summary:
        health > 0
          ? "Fleet progress saved during active play."
          : "Fleet lost after too many container crashes."
    }
  };
}

function getCommandCount(commandCounts) {
  return Object.values(commandCounts).reduce((total, value) => total + value, 0);
}

function GamePage() {
  const [gameId, setGameId] = useState(0);
  const [playerName, setPlayerName] = useState("dockerCadet");
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState("playing");
  const [menu, setMenu] = useState(null);
  const [commandRequest, setCommandRequest] = useState(null);
  const [saveState, setSaveState] = useState("Local session running");
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [fleetCounts, setFleetCounts] = useState({
    runningCount: 0,
    crashedCount: 0,
    stoppedCount: 0,
    commandCounts: {
      start: 0,
      stop: 0,
      restart: 0,
      commit: 0
    }
  });
  const [achievementOverrides, setAchievementOverrides] = useState(null);

  useEffect(() => {
    async function loadUserData() {
      const [currentUser, backendAchievements, backendChallenges, backendEvents] = await Promise.all([
        getCurrentUser(),
        getAchievements(),
        getChallenges(),
        getLiveGameEvents()
      ]);

      if (currentUser?.username) {
        setPlayerName(currentUser.username);
        setSaveState("Backend connected");
      }

      if (backendAchievements?.length) {
        setAchievementOverrides(backendAchievements);
      }

      setChallenges(backendChallenges);
      setLiveEvents(backendEvents);
    }

    loadUserData();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      const events = await getLiveGameEvents();
      setLiveEvents(events);
    }, 3500);

    return () => window.clearInterval(intervalId);
  }, []);

  const localAchievements = useMemo(
    () => buildAchievementList(score, health, fleetCounts.commandCounts),
    [fleetCounts.commandCounts, health, score]
  );

  const achievements = achievementOverrides?.length
    ? achievementOverrides.map((achievement) => ({
        ...achievement,
        unlocked:
          achievement.unlocked ??
          achievement.completed ??
          localAchievements.find((item) => item.key === achievement.key)?.unlocked ??
          false
      }))
    : localAchievements;

  const stats = useMemo(
    () => [
      { label: "Throughput", value: Math.floor(score) },
      { label: "Health", value: `${Math.ceil(health)}%` },
      { label: "XP", value: xp },
      { label: "Level", value: level }
    ],
    [health, level, score, xp]
  );

  const restartGame = useCallback(() => {
    setScore(0);
    setHealth(100);
    setXp(0);
    setLevel(1);
    setGameState("playing");
    setMenu(null);
    setCommandRequest(null);
    setSaveState(activeChallenge ? "Challenge run restarted" : "New fleet deployed");
    setFleetCounts({
      runningCount: 0,
      crashedCount: 0,
      stoppedCount: 0,
      commandCounts: {
        start: 0,
        stop: 0,
        restart: 0,
        commit: 0
      }
    });
    setGameId((currentId) => currentId + 1);
  }, [activeChallenge]);

  function handleStatsChange(nextStats) {
    const roundedScore = Math.floor(nextStats.score);
    const roundedHealth = Math.max(0, Math.ceil(nextStats.health));
    const nextXp = roundedScore + nextStats.commandCounts.commit * 20 + nextStats.commandCounts.restart * 10;
    const nextLevel = Math.max(1, Math.floor(nextXp / 180) + 1);

    setScore(roundedScore);
    setHealth(roundedHealth);
    setXp(nextXp);
    setLevel(nextLevel);
    setFleetCounts(nextStats);
  }

  async function handleGameOver(finalStats) {
    setGameState("gameover");
    setMenu(null);

    const finalScore = Math.floor(finalStats.score);
    const finalHealth = 0;
    const finalXp = finalScore + finalStats.commandCounts.commit * 20 + finalStats.commandCounts.restart * 10;
    const finalLevel = Math.max(1, Math.floor(finalXp / 180) + 1);

    setScore(finalScore);
    setHealth(finalHealth);
    setXp(finalXp);
    setLevel(finalLevel);
    setFleetCounts(finalStats);

    const savePayload = buildSavePayload(finalScore, finalHealth, finalXp, finalLevel);
    const saved = activeChallenge
      ? await completeChallenge({
          ...savePayload,
          challengeId: activeChallenge.id,
          commandCount: getCommandCount(finalStats.commandCounts)
        })
      : await saveGameProgress(savePayload);

    setSaveState(
      saved
        ? activeChallenge
          ? "AI challenge result saved"
          : "Game over saved to backend"
        : "Game over saved locally only"
    );

    if (saved?.liveEvents) {
      setLiveEvents(saved.liveEvents);
    }
  }

  async function handleSubmitChallenge() {
    if (!activeChallenge) {
      setSaveState("Select a challenge before submitting.");
      return;
    }

    const payload = buildSavePayload(score, health, xp, level);
    const saved = await completeChallenge({
      ...payload,
      challengeId: activeChallenge.id,
      commandCount: getCommandCount(fleetCounts.commandCounts)
    });

    setSaveState(saved ? "AI challenge result saved" : "Challenge save failed");

    if (saved?.liveEvents) {
      setLiveEvents(saved.liveEvents);
    }

    if (saved?.challenge?.status) {
      setChallenges((items) =>
        items.map((challenge) =>
          challenge.id === saved.challenge.id
            ? { ...challenge, status: saved.challenge.status }
            : challenge
        )
      );
    }
  }

  function handleSelectChallenge(challenge) {
    restartGame();
    setActiveChallenge(challenge);
    setSaveState(`Challenge armed: ${challenge.title}`);
  }

  function handleCommand(command) {
    if (!menu) {
      return;
    }

    setCommandRequest({
      id: Date.now(),
      command,
      containerId: menu.cubeId
    });
    setMenu(null);
  }

  return (
    <PageLayout
      title="Game"
      description="Click containers on the Docker whale, open the command terminal, and keep the fleet alive."
    >
      <section className="panel fleet-panel">
        <div className="fleet-game-shell">
          <GameScenePlaceholder
            gameId={gameId}
            menuOpen={Boolean(menu)}
            commandRequest={commandRequest}
            onSelectContainer={setMenu}
            onStatsChange={handleStatsChange}
            onGameOver={handleGameOver}
          />

          {menu ? (
            <div
              className="fleet-terminal-menu no-raycast"
              style={{
                left: `${Math.min(menu.x + 16, window.innerWidth - 280)}px`,
                top: `${Math.min(menu.y + 16, window.innerHeight - 220)}px`
              }}
            >
              <div className="fleet-terminal-header">
                <div>
                  <strong>Docker Terminal</strong>
                  <span>{menu.cubeId}</span>
                </div>
                <button type="button" className="button button-secondary" onClick={() => setMenu(null)}>
                  Close
                </button>
              </div>

              <p className="fleet-terminal-status">
                Status: <strong>{menu.cubeState}</strong>
              </p>

              <div className="fleet-terminal-actions">
                {menu.cubeState === "crashed" ? (
                  <button type="button" className="button" onClick={() => handleCommand("restart")}>
                    docker restart
                  </button>
                ) : (
                  <>
                    {menu.cubeState === "running" ? (
                      <button type="button" className="button" onClick={() => handleCommand("stop")}>
                        docker stop
                      </button>
                    ) : null}

                    {menu.cubeState === "stopped" ? (
                      <button type="button" className="button" onClick={() => handleCommand("start")}>
                        docker start
                      </button>
                    ) : null}

                    <button type="button" className="button" onClick={() => handleCommand("commit")}>
                      docker commit
                    </button>

                    {menu.cubeState !== "running" ? (
                      <button type="button" className="button button-secondary" onClick={() => handleCommand("restart")}>
                        docker restart
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ) : null}

          {gameState === "gameover" ? (
            <div className="fleet-gameover">
              <div className="fleet-gameover-card">
                <h2>Fleet Sunk</h2>
                <p>Too many containers crashed. The whale could not keep the load stable.</p>
                <div className="fleet-final-score">
                  <span>Final Throughput</span>
                  <strong>{score}</strong>
                </div>
                <button type="button" className="button" onClick={restartGame}>
                  Redeploy Fleet
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel fleet-info-panel">
        <div className="fleet-title-row">
          <div className="fleet-title-card fleet-title-card-compact">
            <div>
              <p className="fleet-kicker">Docker Fleet</p>
              <h2>Whale Ops</h2>
              <span>Captain: {playerName}</span>
            </div>
            <p>Click a container to open the terminal menu.</p>
          </div>

          <div className="fleet-health-card fleet-health-card-compact">
            <div className="fleet-card-header">
              <span>Ship Integrity</span>
              <strong>{Math.ceil(health)}%</strong>
            </div>
            <div className="fleet-health-bar">
              <div
                className={
                  health > 60
                    ? "fleet-health-fill fleet-health-good"
                    : health > 30
                      ? "fleet-health-fill fleet-health-warning"
                      : "fleet-health-fill fleet-health-danger"
                }
                style={{ width: `${Math.max(0, health)}%` }}
              />
            </div>
            <small>{getHealthLabel(health)}</small>
          </div>
        </div>

        <div className="fleet-score-card fleet-score-card-compact">
          {stats.map((item) => (
            <div className="fleet-score-chip" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="game-layout">
        <div className="game-main-column">
          <section className="panel">
            <h2>Fleet Status</h2>
            <div className="hud-list">
              <div className="hud-row">
                <span>Running Containers</span>
                <strong>{fleetCounts.runningCount}</strong>
              </div>
              <div className="hud-row">
                <span>Crashed Containers</span>
                <strong>{fleetCounts.crashedCount}</strong>
              </div>
              <div className="hud-row">
                <span>Stopped Containers</span>
                <strong>{fleetCounts.stoppedCount}</strong>
              </div>
              <div className="hud-row">
                <span>Backend Status</span>
                <strong>{saveState}</strong>
              </div>
              <div className="hud-row">
                <span>Active Challenge</span>
                <strong>{activeChallenge?.title || "Solo Run"}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Async AI Challenge Mode</h2>
            <div className="challenge-list">
              {challenges.map((challenge) => (
                <button
                  type="button"
                  className={
                    activeChallenge?.id === challenge.id
                      ? "challenge-card challenge-card-active"
                      : "challenge-card"
                  }
                  key={challenge.id}
                  onClick={() => handleSelectChallenge(challenge)}
                >
                  <strong>{challenge.title}</strong>
                  <span>{challenge.description}</span>
                  <small>
                    {challenge.rewardXp} XP / {challenge.rewardCredits} credits / {challenge.status}
                  </small>
                </button>
              ))}
            </div>

            <div className="button-row">
              <button type="button" className="button" onClick={handleSubmitChallenge}>
                Submit AI Challenge
              </button>
              <button type="button" className="button button-secondary" onClick={() => setActiveChallenge(null)}>
                Solo Mode
              </button>
            </div>
          </section>
        </div>

        <aside className="game-side-column">
          <section className="panel">
            <h2>Achievements</h2>
            <div className="achievement-list">
              {achievements.map((achievement) => (
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
            <h2>How To Play</h2>
            <ul>
              <li>Click a container on the whale.</li>
              <li>Use docker commands from the terminal menu.</li>
              <li>Restart crashed containers before ship integrity reaches zero.</li>
              <li>Use docker commit on running containers to raise score and XP.</li>
            </ul>
          </section>

          <section className="panel">
            <h2>Live Game Events</h2>
            <div className="event-list">
              {liveEvents.length ? (
                liveEvents.slice(0, 5).map((event) => (
                  <div className="event-card" key={event.id}>
                    <strong>{event.type}</strong>
                    <p>{event.message}</p>
                    <span>
                      Score {event.score} / Health {event.health}
                    </span>
                  </div>
                ))
              ) : (
                <p className="todo-note">No live events yet. Save a run or submit a challenge.</p>
              )}
            </div>
          </section>
        </aside>
      </section>
    </PageLayout>
  );
}

export default GamePage;
