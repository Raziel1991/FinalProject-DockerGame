const missionSteps = [
  "Build the base image",
  "Start the main container",
  "Restart unstable services",
  "Patch the system leak"
];

const baseAchievements = [
  {
    key: "first-build",
    title: "First Build",
    description: "Use Build Image one time.",
    unlocked: false
  },
  {
    key: "service-keeper",
    title: "Service Keeper",
    description: "Raise container health to 90% or more.",
    unlocked: false
  },
  {
    key: "mission-ready",
    title: "Mission Ready",
    description: "Finish all mock mission steps.",
    unlocked: false
  }
];

export function createInitialGameState() {
  return {
    score: 1250,
    xp: 340,
    level: 3,
    containerHealth: 84,
    missionStatus: "Standby",
    missionIndex: 0,
    missionProgress: 0,
    achievements: baseAchievements,
    recentMatchResult: {
      result: "No match played yet",
      scoreEarned: 0,
      xpEarned: 0,
      summary: "Run a few mock actions to simulate a mission result."
    },
    actionCounts: {
      buildImage: 0,
      startContainer: 0,
      restartService: 0,
      patchLeak: 0
    }
  };
}

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor(xp / 150) + 1);
}

function clampHealth(health) {
  return Math.max(0, Math.min(100, health));
}

function unlockAchievements(state) {
  return state.achievements.map((achievement) => {
    if (achievement.key === "first-build" && state.actionCounts.buildImage >= 1) {
      return { ...achievement, unlocked: true };
    }

    if (achievement.key === "service-keeper" && state.containerHealth >= 90) {
      return { ...achievement, unlocked: true };
    }

    if (achievement.key === "mission-ready" && state.missionIndex >= missionSteps.length) {
      return { ...achievement, unlocked: true };
    }

    return achievement;
  });
}

function buildRecentMatchResult(state, scoreEarned, xpEarned, summary) {
  return {
    result: state.missionIndex >= missionSteps.length ? "Mock Mission Complete" : "Mock Mission Active",
    scoreEarned,
    xpEarned,
    summary
  };
}

export function applyMockAction(previousState, actionKey) {
  const actionMap = {
    buildImage: {
      scoreDelta: 100,
      xpDelta: 25,
      healthDelta: -2,
      missionStatus: "Image Built",
      summary: "The image build finished. The system is ready for the next step."
    },
    startContainer: {
      scoreDelta: 140,
      xpDelta: 35,
      healthDelta: 4,
      missionStatus: "Container Running",
      summary: "The main container started and system pressure is stable."
    },
    restartService: {
      scoreDelta: 90,
      xpDelta: 20,
      healthDelta: 12,
      missionStatus: "Service Restarted",
      summary: "Core services restarted. Uptime improved."
    },
    patchLeak: {
      scoreDelta: 120,
      xpDelta: 30,
      healthDelta: 16,
      missionStatus: "Leak Patched",
      summary: "The leak is patched. The mock mission is close to stable."
    }
  };

  const action = actionMap[actionKey];

  if (!action) {
    return previousState;
  }

  const nextMissionIndex = Math.min(previousState.missionIndex + 1, missionSteps.length);
  const nextXp = previousState.xp + action.xpDelta;
  const nextState = {
    ...previousState,
    score: previousState.score + action.scoreDelta,
    xp: nextXp,
    level: getLevelFromXp(nextXp),
    containerHealth: clampHealth(previousState.containerHealth + action.healthDelta),
    missionStatus:
      nextMissionIndex >= missionSteps.length ? "Mission Complete" : action.missionStatus,
    missionIndex: nextMissionIndex,
    missionProgress: Math.round((nextMissionIndex / missionSteps.length) * 100),
    actionCounts: {
      ...previousState.actionCounts,
      [actionKey]: previousState.actionCounts[actionKey] + 1
    }
  };

  const achievements = unlockAchievements(nextState);

  return {
    ...nextState,
    achievements,
    recentMatchResult: buildRecentMatchResult(
      nextState,
      action.scoreDelta,
      action.xpDelta,
      action.summary
    )
  };
}

export function getMockMissionSteps() {
  return missionSteps;
}

export function getMockLeaderboard(currentGameState) {
  const rows = [
    { rank: 1, player: "stackCaptain", level: 6, score: 2280, status: "Top Demo Score" },
    { rank: 2, player: "portMapper", level: 5, score: 1975, status: "Stable Build" },
    { rank: 3, player: "yamlWizard", level: 5, score: 1840, status: "Fast Recovery" }
  ];

  const playerRow = {
    rank: 4,
    player: "dockerCadet",
    level: currentGameState?.level ?? 3,
    score: currentGameState?.score ?? 1250,
    status: currentGameState?.missionStatus ?? "Standby"
  };

  return [...rows, playerRow].sort((a, b) => b.score - a.score).map((row, index) => ({
    ...row,
    rank: index + 1
  }));
}

export function getMockAchievements() {
  return baseAchievements;
}

// TODO: Replace this file with GraphQL operations such as saveGameProgress,
// getLeaderboard, and getAchievements when the backend contract is ready.
