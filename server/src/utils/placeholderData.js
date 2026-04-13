const placeholderUsers = [
  {
    id: "placeholder-user-1",
    username: "stackCaptain",
    email: "stackCaptain@example.com",
    avatarUrl: "",
    role: "player",
    createdAt: new Date("2026-01-12T10:00:00.000Z")
  },
  {
    id: "placeholder-user-2",
    username: "portMapper",
    email: "portMapper@example.com",
    avatarUrl: "",
    role: "player",
    createdAt: new Date("2026-01-15T10:00:00.000Z")
  },
  {
    id: "placeholder-user-3",
    username: "yamlWizard",
    email: "yamlWizard@example.com",
    avatarUrl: "",
    role: "player",
    createdAt: new Date("2026-01-19T10:00:00.000Z")
  }
];

export const placeholderAchievements = [
  {
    id: "placeholder-achievement-1",
    user: placeholderUsers[0],
    key: "first-deploy",
    title: "First Deploy",
    description: "Complete the first Docker deployment mission.",
    xpReward: 100,
    badgeIcon: "rocket",
    completed: true,
    unlockedAt: new Date("2026-03-01T09:00:00.000Z")
  },
  {
    id: "placeholder-achievement-2",
    user: placeholderUsers[0],
    key: "clean-compose",
    title: "Clean Compose",
    description: "Finish a mission without a container failure.",
    xpReward: 150,
    badgeIcon: "shield",
    completed: false,
    unlockedAt: null
  }
];

export const placeholderLeaderboard = [
  {
    id: "placeholder-leaderboard-1",
    user: placeholderUsers[0],
    score: 2280,
    rank: 1,
    season: "Season 1",
    mode: "solo",
    achievedAt: new Date("2026-04-01T12:00:00.000Z")
  },
  {
    id: "placeholder-leaderboard-2",
    user: placeholderUsers[1],
    score: 1975,
    rank: 2,
    season: "Season 1",
    mode: "solo",
    achievedAt: new Date("2026-04-02T12:00:00.000Z")
  },
  {
    id: "placeholder-leaderboard-3",
    user: placeholderUsers[2],
    score: 1840,
    rank: 3,
    season: "Season 1",
    mode: "solo",
    achievedAt: new Date("2026-04-03T12:00:00.000Z")
  }
];

export const placeholderChallenges = [
  {
    id: "placeholder-challenge-1",
    assignedTo: null,
    title: "Patch the Container Leak",
    description: "Resolve three failing container routes in one session.",
    type: "daily",
    rewardXp: 80,
    rewardCredits: 40,
    isActive: true,
    status: "available",
    dueDate: new Date("2026-04-20T23:59:00.000Z")
  },
  {
    id: "placeholder-challenge-2",
    assignedTo: null,
    title: "Image Sorting Drill",
    description: "Classify ten images without triggering a system crash.",
    type: "weekly",
    rewardXp: 180,
    rewardCredits: 90,
    isActive: true,
    status: "available",
    dueDate: new Date("2026-04-30T23:59:00.000Z")
  }
];

export const placeholderMatches = [
  {
    id: "placeholder-match-1",
    user: placeholderUsers[0],
    opponentName: "Sentinel AI",
    opponentType: "ai",
    result: "win",
    scoreEarned: 320,
    xpEarned: 75,
    completedAt: new Date("2026-04-10T18:30:00.000Z"),
    notes: "Placeholder match result for dashboard demos."
  },
  {
    id: "placeholder-match-2",
    user: placeholderUsers[0],
    opponentName: "Firewall Matrix",
    opponentType: "ai",
    result: "loss",
    scoreEarned: 120,
    xpEarned: 20,
    completedAt: new Date("2026-04-11T18:30:00.000Z"),
    notes: "TODO: replace with stored match history in Phase 3."
  }
];
