const missionQueue = [
  "buildImage",
  "startContainer",
  "restartService",
  "patchLeak",
  "startContainer",
  "patchLeak"
];

const actionLabels = {
  buildImage: "Build Image",
  startContainer: "Start Container",
  restartService: "Restart Service",
  patchLeak: "Patch Leak"
};

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
    description: "Keep container health at 90 or more.",
    unlocked: false
  },
  {
    key: "mission-ready",
    title: "Mission Ready",
    description: "Finish the full mission route.",
    unlocked: false
  }
];

function getLevelFromXp(xp) {
  return Math.max(1, Math.floor(xp / 150) + 1);
}

function clampHealth(health) {
  return Math.max(0, Math.min(100, health));
}

function buildMatchResult({ result, scoreEarned, xpEarned, summary }) {
  return {
    result,
    scoreEarned,
    xpEarned,
    summary
  };
}

function updateAchievements(state) {
  return state.achievements.map((achievement) => {
    if (achievement.key === "first-build" && state.actionCounts.buildImage >= 1) {
      return { ...achievement, unlocked: true };
    }

    if (achievement.key === "service-keeper" && state.containerHealth >= 90) {
      return { ...achievement, unlocked: true };
    }

    if (achievement.key === "mission-ready" && state.isMissionComplete) {
      return { ...achievement, unlocked: true };
    }

    return achievement;
  });
}

function withAchievements(state) {
  return {
    ...state,
    achievements: updateAchievements(state)
  };
}

export function createInitialGameState() {
  return {
    score: 1250,
    xp: 340,
    level: 3,
    containerHealth: 84,
    missionProgress: 0,
    missionStatus: "Ready to start",
    missionIndex: 0,
    missionQueue,
    currentObjective: missionQueue[0],
    timeLeft: 60,
    isMissionActive: false,
    isMissionComplete: false,
    isMissionFailed: false,
    feedbackMessage: "Press Start Mission to begin the Docker recovery run.",
    achievements: baseAchievements,
    recentMatchResult: buildMatchResult({
      result: "No match played yet",
      scoreEarned: 0,
      xpEarned: 0,
      summary: "Complete the mission route to record a real result."
    }),
    actionCounts: {
      buildImage: 0,
      startContainer: 0,
      restartService: 0,
      patchLeak: 0
    }
  };
}

export function startMission(previousState) {
  return {
    ...previousState,
    timeLeft: 60,
    containerHealth: 100,
    missionProgress: 0,
    missionStatus: "Mission running",
    missionIndex: 0,
    currentObjective: missionQueue[0],
    isMissionActive: true,
    isMissionComplete: false,
    isMissionFailed: false,
    feedbackMessage: `Current objective: ${actionLabels[missionQueue[0]]}.`,
    recentMatchResult: buildMatchResult({
      result: "Mission started",
      scoreEarned: 0,
      xpEarned: 0,
      summary: "Follow the mission order before time runs out."
    })
  };
}

export function runMissionTick(previousState) {
  if (!previousState.isMissionActive) {
    return previousState;
  }

  const nextTimeLeft = Math.max(0, previousState.timeLeft - 1);
  const nextHealth = clampHealth(previousState.containerHealth - 1);

  if (nextTimeLeft === 0 || nextHealth === 0) {
    const failedState = {
      ...previousState,
      timeLeft: nextTimeLeft,
      containerHealth: nextHealth,
      isMissionActive: false,
      isMissionFailed: true,
      missionStatus: nextHealth === 0 ? "Container failure" : "Mission timeout",
      feedbackMessage:
        nextHealth === 0
          ? "The container grid collapsed. Restart the mission."
          : "Time expired before the mission route was completed.",
      recentMatchResult: buildMatchResult({
        result: "Mission failed",
        scoreEarned: 0,
        xpEarned: 0,
        summary:
          nextHealth === 0
            ? "Failure: container health dropped to zero."
            : "Failure: mission timer reached zero."
      })
    };

    return withAchievements(failedState);
  }

  return withAchievements({
    ...previousState,
    timeLeft: nextTimeLeft,
    containerHealth: nextHealth
  });
}

export function applyMockAction(previousState, actionKey) {
  if (!previousState.isMissionActive || previousState.isMissionComplete || previousState.isMissionFailed) {
    return previousState;
  }

  const expectedAction = previousState.currentObjective;
  const wasCorrect = actionKey === expectedAction;

  if (!wasCorrect) {
    const wrongState = {
      ...previousState,
      score: Math.max(0, previousState.score - 60),
      containerHealth: clampHealth(previousState.containerHealth - 12),
      missionStatus: "Wrong action",
      feedbackMessage: `Wrong move. Expected ${actionLabels[expectedAction]}.`,
      recentMatchResult: buildMatchResult({
        result: "Mission active",
        scoreEarned: -60,
        xpEarned: 0,
        summary: `Wrong action used. Expected ${actionLabels[expectedAction]}.`
      }),
      actionCounts: {
        ...previousState.actionCounts,
        [actionKey]: previousState.actionCounts[actionKey] + 1
      }
    };

    if (wrongState.containerHealth === 0) {
      return withAchievements({
        ...wrongState,
        isMissionActive: false,
        isMissionFailed: true,
        missionStatus: "Container failure",
        feedbackMessage: "Container health reached zero. Mission failed.",
        recentMatchResult: buildMatchResult({
          result: "Mission failed",
          scoreEarned: -60,
          xpEarned: 0,
          summary: "Failure: wrong action caused total container failure."
        })
      });
    }

    return withAchievements(wrongState);
  }

  const nextMissionIndex = previousState.missionIndex + 1;
  const nextXp = previousState.xp + 35;
  const nextScore = previousState.score + 150;
  const nextProgress = Math.round((nextMissionIndex / previousState.missionQueue.length) * 100);
  const nextObjective = previousState.missionQueue[nextMissionIndex] || null;

  const nextState = {
    ...previousState,
    score: nextScore,
    xp: nextXp,
    level: getLevelFromXp(nextXp),
    containerHealth: clampHealth(previousState.containerHealth + 5),
    missionIndex: nextMissionIndex,
    missionProgress: nextProgress,
    currentObjective: nextObjective,
    missionStatus: nextObjective ? "Objective cleared" : "Mission complete",
    feedbackMessage: nextObjective
      ? `Good move. Next objective: ${actionLabels[nextObjective]}.`
      : "All objectives complete. Mission success.",
    actionCounts: {
      ...previousState.actionCounts,
      [actionKey]: previousState.actionCounts[actionKey] + 1
    },
    recentMatchResult: buildMatchResult({
      result: nextObjective ? "Mission active" : "Mission complete",
      scoreEarned: nextObjective ? 150 : 450,
      xpEarned: nextObjective ? 35 : 135,
      summary: nextObjective
        ? `${actionLabels[actionKey]} completed successfully.`
        : "Mission completed. Bonus score and XP awarded."
    })
  };

  if (!nextObjective) {
    return withAchievements({
      ...nextState,
      score: nextState.score + 300,
      xp: nextState.xp + 100,
      level: getLevelFromXp(nextState.xp + 100),
      isMissionActive: false,
      isMissionComplete: true
    });
  }

  return withAchievements(nextState);
}

export function getMockMissionSteps() {
  return missionQueue.map((step) => actionLabels[step]);
}

export function getObjectiveLabel(objectiveKey) {
  return objectiveKey ? actionLabels[objectiveKey] : "None";
}

export function getMockLeaderboard(currentGameState) {
  const rows = [
    { rank: 1, player: "stackCaptain", level: 6, xp: 910, score: 2280, status: "Mission Complete" },
    { rank: 2, player: "portMapper", level: 5, xp: 760, score: 1975, status: "Stable Build" },
    { rank: 3, player: "yamlWizard", level: 5, xp: 720, score: 1840, status: "Fast Recovery" }
  ];

  const playerRow = {
    rank: 4,
    player: "dockerCadet",
    level: currentGameState?.level ?? 3,
    xp: currentGameState?.xp ?? 340,
    score: currentGameState?.score ?? 1250,
    status: currentGameState?.missionStatus ?? "Ready to start"
  };

  return [...rows, playerRow].sort((a, b) => b.score - a.score).map((row, index) => ({
    ...row,
    rank: index + 1
  }));
}

export function getMockAchievements() {
  return baseAchievements;
}
