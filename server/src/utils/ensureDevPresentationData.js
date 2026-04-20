import Challenge from "../models/Challenge.js";
import GameProfile from "../models/GameProfile.js";
import LeaderboardEntry from "../models/LeaderboardEntry.js";
import User from "../models/User.js";

const demoPlayers = [
  {
    username: "stackCaptain",
    email: "stackCaptain@example.com",
    level: 6,
    xp: 910,
    totalScore: 2280,
    containerHealth: 96,
    missionProgress: 100,
    missionStatus: "Mission Complete"
  },
  {
    username: "portMapper",
    email: "portMapper@example.com",
    level: 5,
    xp: 760,
    totalScore: 1975,
    containerHealth: 89,
    missionProgress: 82,
    missionStatus: "Service Restarted"
  },
  {
    username: "yamlWizard",
    email: "yamlWizard@example.com",
    level: 5,
    xp: 720,
    totalScore: 1840,
    containerHealth: 85,
    missionProgress: 74,
    missionStatus: "Leak Patched"
  }
];

const demoChallenges = [
  {
    title: "Patch the Container Leak",
    description: "Finish one run with container health above 80 percent.",
    type: "daily",
    rewardXp: 80,
    rewardCredits: 40,
    status: "available"
  },
  {
    title: "Fast Recovery",
    description: "Reach 1000 points in one session.",
    type: "weekly",
    rewardXp: 150,
    rewardCredits: 80,
    status: "available"
  },
  {
    title: "Adaptive Sentinel Duel",
    description: "Outscore the AI while keeping container health above zero.",
    type: "ai",
    rewardXp: 220,
    rewardCredits: 120,
    status: "available"
  }
];

export async function ensureDevPresentationData() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  for (const player of demoPlayers) {
    const user = await User.findOne({ email: player.email });

    if (!user) {
      continue;
    }

    await GameProfile.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          level: player.level,
          xp: player.xp,
          totalScore: player.totalScore,
          containerHealth: player.containerHealth,
          missionProgress: player.missionProgress,
          missionStatus: player.missionStatus,
          currentStage: player.missionProgress >= 100 ? "Completed" : "Dock-01"
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    await LeaderboardEntry.findOneAndUpdate(
      { user: user._id, season: "Season 1", mode: "solo" },
      {
        $set: {
          score: player.totalScore,
          season: "Season 1",
          mode: "solo",
          achievedAt: new Date()
        }
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );
  }

  const leaderboardEntries = await LeaderboardEntry.find({ season: "Season 1", mode: "solo" }).sort({
    score: -1,
    achievedAt: 1
  });

  for (let index = 0; index < leaderboardEntries.length; index += 1) {
    const entry = leaderboardEntries[index];
    if (entry.rank !== index + 1) {
      entry.rank = index + 1;
      await entry.save();
    }
  }

  for (const challenge of demoChallenges) {
    await Challenge.findOneAndUpdate(
      { title: challenge.title, assignedTo: null },
      {
        $set: {
          description: challenge.description,
          type: challenge.type,
          rewardXp: challenge.rewardXp,
          rewardCredits: challenge.rewardCredits,
          isActive: true,
          status: challenge.status,
          dueDate: null
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }

  console.log("Development presentation data ready.");
}
