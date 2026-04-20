import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import User from "../../models/User.js";
import GameProfile from "../../models/GameProfile.js";
import Achievement from "../../models/Achievement.js";
import LeaderboardEntry from "../../models/LeaderboardEntry.js";
import Challenge from "../../models/Challenge.js";
import MatchResult from "../../models/MatchResult.js";
import { signToken } from "../../utils/jwt.js";
import {
  placeholderAchievements,
  placeholderChallenges,
  placeholderMatches
} from "../../utils/placeholderData.js";

const gameActionEvents = [];

function pushGameActionEvent({ user, type, message, score = 0, health = 100 }) {
  const event = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    user: user || null,
    type,
    message,
    score,
    health,
    createdAt: new Date()
  };

  gameActionEvents.unshift(event);
  gameActionEvents.splice(25);

  return event;
}

function getUserEvents(userId) {
  return gameActionEvents.filter((event) => {
    if (!event.user || !userId) {
      return true;
    }

    return String(event.user._id || event.user.id || event.user) === String(userId);
  });
}

async function rankLeaderboard() {
  const rankedEntries = await LeaderboardEntry.find({ season: "Season 1", mode: "solo" })
    .sort({ score: -1, achievedAt: 1 });

  for (let index = 0; index < rankedEntries.length; index += 1) {
    const entry = rankedEntries[index];
    if (entry.rank !== index + 1) {
      entry.rank = index + 1;
      await entry.save();
    }
  }
}

function buildChallengeResult(input, challenge) {
  const aiScore = Math.max(
    180,
    Math.round(challenge.rewardXp * 3.5 + input.commandCount * 18 + (100 - input.containerHealth) * 4)
  );
  const playerScore = input.score + input.containerHealth * 4 + input.commandCount * 25;
  const success = input.missionProgress >= 70 && input.containerHealth > 0 && playerScore >= aiScore;

  return {
    aiScore,
    playerScore,
    success,
    result: success ? "challenge-win" : "challenge-loss"
  };
}

function requireAuth(currentUser) {
  if (!currentUser) {
    throw new GraphQLError("Authentication required.", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }
}

async function syncAchievementsForProfile(profile) {
  const userId = profile.user._id || profile.user;
  const rules = [
    {
      key: "first-build",
      title: "First Build",
      description: "Save your first gameplay progress update.",
      xpReward: 50,
      badgeIcon: "rocket",
      completed: true
    },
    {
      key: "service-keeper",
      title: "Service Keeper",
      description: "Keep container health at 90 or higher.",
      xpReward: 75,
      badgeIcon: "shield",
      completed: profile.containerHealth >= 90
    },
    {
      key: "mission-ready",
      title: "Mission Ready",
      description: "Reach 100 percent mission progress.",
      xpReward: 100,
      badgeIcon: "star",
      completed: profile.missionProgress >= 100
    },
    {
      key: "credit-hacker",
      title: "Credit Hacker",
      description: "Earn at least 100 credits from rewards.",
      xpReward: 120,
      badgeIcon: "coin",
      completed: profile.credits >= 100
    },
    {
      key: "cosmetic-unlocked",
      title: "Cosmetic Unlocked",
      description: "Unlock a cosmetic item from challenge rewards.",
      xpReward: 90,
      badgeIcon: "spark",
      completed: profile.unlockedCosmetics.length > 0
    }
  ];

  const achievementIds = [];

  for (const rule of rules) {
    const achievement = await Achievement.findOneAndUpdate(
      { user: userId, key: rule.key },
      {
        $set: {
          title: rule.title,
          description: rule.description,
          xpReward: rule.xpReward,
          badgeIcon: rule.badgeIcon,
          completed: rule.completed,
          unlockedAt: rule.completed ? new Date() : null
        },
        $setOnInsert: {
          user: userId
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );

    achievementIds.push(achievement._id);
  }

  await GameProfile.findByIdAndUpdate(profile._id, {
    $set: {
      achievements: achievementIds
    }
  });

  return Achievement.find({ user: userId }).populate("user").sort({ createdAt: -1 });
}

async function findOrCreateProfile(userId) {
  let profile = await GameProfile.findOne({ user: userId }).populate("user");

  if (!profile) {
    profile = await GameProfile.create({ user: userId });
    profile = await GameProfile.findOne({ user: userId }).populate("user");
  }

  return profile;
}

export const resolvers = {
  Query: {
    health: () => "OK",
    me: async (_, __, { currentUser }) => currentUser,
    currentUser: async (_, __, { currentUser }) => currentUser,
    profile: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return {
          user: null,
          profile: null,
          achievements: placeholderAchievements
        };
      }

      const [profile, achievements] = await Promise.all([
        findOrCreateProfile(currentUser.id),
        Achievement.find({ user: currentUser.id }).populate("user").sort({ createdAt: -1 })
      ]);

      return {
        user: currentUser,
        profile,
        achievements: achievements.length > 0 ? achievements : placeholderAchievements
      };
    },
    gameProfile: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return null;
      }

      return findOrCreateProfile(currentUser.id);
    },
    achievements: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return placeholderAchievements;
      }

      const achievements = await Achievement.find({ user: currentUser.id })
        .populate("user")
        .sort({ createdAt: -1 });

      return achievements.length > 0 ? achievements : placeholderAchievements;
    },
    getAchievements: async (_, __, context) => resolvers.Query.achievements(_, __, context),
    leaderboard: async () => {
      const entries = await LeaderboardEntry.find()
        .populate("user")
        .sort({ score: -1, achievedAt: 1 })
        .limit(10);

      return entries;
    },
    getLeaderboard: async () => resolvers.Query.leaderboard(),
    challenges: async (_, __, { currentUser }) => {
      const query = currentUser
        ? { $or: [{ assignedTo: currentUser.id }, { assignedTo: null }] }
        : { assignedTo: null };

      const challenges = await Challenge.find(query).populate("assignedTo").limit(10);
      return challenges.length > 0 ? challenges : placeholderChallenges;
    },
    recentMatches: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return placeholderMatches;
      }

      const results = await MatchResult.find({ user: currentUser.id })
        .populate("user")
        .sort({ completedAt: -1 })
        .limit(10);

      return results.length > 0 ? results : placeholderMatches;
    },
    liveGameEvents: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return gameActionEvents;
      }

      return getUserEvents(currentUser.id);
    },
    dashboard: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return {
          profile: null,
          achievements: placeholderAchievements,
          recentMatches: placeholderMatches,
          activeChallenges: placeholderChallenges,
          liveEvents: gameActionEvents
        };
      }

      const [profile, achievements, recentMatches, challenges] = await Promise.all([
        findOrCreateProfile(currentUser.id),
        Achievement.find({ user: currentUser.id }).populate("user").sort({ createdAt: -1 }),
        MatchResult.find({ user: currentUser.id })
          .populate("user")
          .sort({ completedAt: -1 })
          .limit(5),
        Challenge.find({
          $or: [{ assignedTo: currentUser.id }, { assignedTo: null }]
        })
          .populate("assignedTo")
          .limit(5)
      ]);

      return {
        profile,
        achievements: achievements.length > 0 ? achievements : placeholderAchievements,
        recentMatches: recentMatches.length > 0 ? recentMatches : placeholderMatches,
        activeChallenges: challenges.length > 0 ? challenges : placeholderChallenges,
        liveEvents: getUserEvents(currentUser.id)
      };
    }
  },
  Mutation: {
    register: async (_, { input }) => {
      const { username, email, password } = input;

      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }]
      });

      if (existingUser) {
        throw new GraphQLError("User already exists.", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        password: hashedPassword
      });

      const gameProfile = await GameProfile.create({
        user: user._id
      });

      const populatedProfile = await GameProfile.findById(gameProfile._id).populate("user");
      const token = signToken(user);

      return {
        token,
        user,
        gameProfile: populatedProfile
      };
    },
    login: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

      if (!user) {
        throw new GraphQLError("Invalid email or password.", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        throw new GraphQLError("Invalid email or password.", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const token = signToken(user);
      const gameProfile = await findOrCreateProfile(user._id);

      return {
        token,
        user,
        gameProfile
      };
    },
    updateMyGameProfile: async (_, { input }, { currentUser }) => {
      requireAuth(currentUser);

      const profile = await GameProfile.findOneAndUpdate(
        { user: currentUser.id },
        { $set: input },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).populate("user");

      return profile;
    },
    saveGameProgress: async (_, { input }, { currentUser }) => {
      requireAuth(currentUser);

      const creditBonus = input.missionProgress >= 100 ? 35 : 10;
      const nextCosmetics =
        input.missionProgress >= 100 ? ["neon-whale-trail"] : [];

      const profile = await GameProfile.findOneAndUpdate(
        { user: currentUser.id },
        {
          $set: {
            totalScore: input.score,
            xp: input.xp,
            level: input.level,
            containerHealth: input.containerHealth,
            missionProgress: input.missionProgress,
            missionStatus: input.missionStatus,
            reputation: input.missionProgress,
            currentStage: input.missionProgress >= 100 ? "Completed" : "Dock-01"
          },
          $inc: {
            credits: creditBonus
          },
          $addToSet: {
            unlockedCosmetics: { $each: nextCosmetics }
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      ).populate("user");

      const achievements = await syncAchievementsForProfile(profile);

      const recentMatchResult = await MatchResult.create({
          user: currentUser.id,
          opponentName: "Mock Docker System",
          opponentType: input.challengeId ? "ai" : "system",
          result: input.result || "progress",
          scoreEarned: input.scoreEarned || 0,
          xpEarned: input.xpEarned || 0,
          notes: input.notes || "Game progress saved through GraphQL."
        });

      const leaderboardEntry = await LeaderboardEntry.findOneAndUpdate(
        { user: currentUser.id, season: "Season 1", mode: "solo" },
        {
          $set: {
            score: input.score,
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
      ).populate("user");

      await rankLeaderboard();

      pushGameActionEvent({
        user: currentUser,
        type: "progress-saved",
        message: `${currentUser.username} saved a run for ${input.score} points and earned ${creditBonus} credits.`,
        score: input.score,
        health: input.containerHealth
      });

      const refreshedProfile = await GameProfile.findById(profile._id).populate("user");
      const refreshedLeaderboardEntry = await LeaderboardEntry.findById(leaderboardEntry._id).populate(
        "user"
      );
      const refreshedRecentMatch = await MatchResult.findById(recentMatchResult._id).populate("user");

      return {
        profile: refreshedProfile,
        achievements,
        recentMatchResult: refreshedRecentMatch,
        leaderboardEntry: refreshedLeaderboardEntry,
        liveEvents: getUserEvents(currentUser.id)
      };
    },
    completeChallenge: async (_, { input }, { currentUser }) => {
      requireAuth(currentUser);

      const challenge = await Challenge.findById(input.challengeId);

      if (!challenge || !challenge.isActive) {
        throw new GraphQLError("Challenge is not available.", {
          extensions: { code: "BAD_USER_INPUT" }
        });
      }

      const challengeResult = buildChallengeResult(input, challenge);
      const earnedXp = challengeResult.success ? challenge.rewardXp : Math.round(challenge.rewardXp / 3);
      const earnedCredits = challengeResult.success
        ? challenge.rewardCredits
        : Math.round(challenge.rewardCredits / 4);
      const cosmeticReward = challengeResult.success ? [`${challenge.type}-operator-skin`] : [];

      const profile = await GameProfile.findOneAndUpdate(
        { user: currentUser.id },
        {
          $set: {
            totalScore: Math.max(input.score, challengeResult.playerScore),
            xp: input.xp + earnedXp,
            level: Math.max(input.level, Math.floor((input.xp + earnedXp) / 180) + 1),
            containerHealth: input.containerHealth,
            missionProgress: input.missionProgress,
            missionStatus: challengeResult.success ? "Challenge Complete" : "Challenge Failed",
            reputation: input.missionProgress,
            currentStage: challengeResult.success ? "Challenge Cleared" : "Dock-01"
          },
          $inc: {
            credits: earnedCredits
          },
          $addToSet: {
            unlockedCosmetics: { $each: cosmeticReward }
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      ).populate("user");

      const updatedChallenge = await Challenge.findByIdAndUpdate(
        challenge._id,
        {
          $set: {
            assignedTo: currentUser.id,
            status: challengeResult.success ? "completed" : "attempted"
          }
        },
        {
          new: true
        }
      ).populate("assignedTo");

      const recentMatchResult = await MatchResult.create({
        user: currentUser.id,
        opponentName: "Adaptive Sentinel AI",
        opponentType: "ai",
        result: challengeResult.result,
        scoreEarned: challengeResult.playerScore,
        xpEarned: earnedXp,
        notes: `AI scored ${challengeResult.aiScore}. Player scored ${challengeResult.playerScore}.`
      });

      const leaderboardEntry = await LeaderboardEntry.findOneAndUpdate(
        { user: currentUser.id, season: "Season 1", mode: "solo" },
        {
          $set: {
            score: Math.max(input.score, challengeResult.playerScore),
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
      ).populate("user");

      await rankLeaderboard();
      const achievements = await syncAchievementsForProfile(profile);

      pushGameActionEvent({
        user: currentUser,
        type: "challenge-complete",
        message: `${currentUser.username} ${challengeResult.success ? "beat" : "challenged"} the Adaptive Sentinel AI in ${challenge.title}.`,
        score: challengeResult.playerScore,
        health: input.containerHealth
      });

      const refreshedLeaderboardEntry = await LeaderboardEntry.findById(leaderboardEntry._id).populate(
        "user"
      );
      const refreshedRecentMatch = await MatchResult.findById(recentMatchResult._id).populate("user");

      return {
        profile,
        challenge: updatedChallenge,
        achievements,
        recentMatchResult: refreshedRecentMatch,
        leaderboardEntry: refreshedLeaderboardEntry,
        liveEvents: getUserEvents(currentUser.id)
      };
    },
    resetMyGameProgress: async (_, __, { currentUser }) => {
      requireAuth(currentUser);

      const profile = await GameProfile.findOneAndUpdate(
        { user: currentUser.id },
        {
          $set: {
            level: 1,
            xp: 0,
            totalScore: 0,
            reputation: 0,
            credits: 0,
            currentStage: "Dock-01",
            containerHealth: 100,
            missionProgress: 0,
            missionStatus: "Standby",
            unlockedCosmetics: [],
            achievements: []
          }
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        }
      ).populate("user");

      await Achievement.deleteMany({ user: currentUser.id });

      pushGameActionEvent({
        user: currentUser,
        type: "progress-reset",
        message: `${currentUser.username} reset their game profile.`,
        score: 0,
        health: 100
      });

      return profile;
    },
    clearMyMatchHistory: async (_, __, { currentUser }) => {
      requireAuth(currentUser);
      await MatchResult.deleteMany({ user: currentUser.id });

      pushGameActionEvent({
        user: currentUser,
        type: "history-cleared",
        message: `${currentUser.username} cleared match history.`,
        score: 0,
        health: 100
      });

      return true;
    }
  },
  User: {
    id: (parent) => String(parent.id || parent._id),
    createdAt: (parent) => new Date(parent.createdAt).toISOString()
  },
  GameProfile: {
    id: (parent) => String(parent.id || parent._id),
    user: async (parent) => {
      if (parent.user?.email) {
        return parent.user;
      }

      return User.findById(parent.user);
    },
    achievements: async (parent) => {
      if (Array.isArray(parent.achievements) && parent.achievements.length > 0) {
        if (parent.achievements[0]?.title) {
          return parent.achievements;
        }

        return Achievement.find({ _id: { $in: parent.achievements } });
      }

      if (parent.user) {
        const userId = parent.user._id || parent.user;
        const achievements = await Achievement.find({ user: userId }).limit(10);
        return achievements.length > 0 ? achievements : placeholderAchievements;
      }

      return placeholderAchievements;
    }
  },
  Achievement: {
    id: (parent) => String(parent.id || parent._id),
    user: async (parent) => {
      if (!parent.user) {
        return null;
      }

      if (parent.user?.email) {
        return parent.user;
      }

      return User.findById(parent.user);
    },
    unlockedAt: (parent) => (parent.unlockedAt ? new Date(parent.unlockedAt).toISOString() : null)
  },
  LeaderboardEntry: {
    id: (parent) => String(parent.id || parent._id),
    user: async (parent) => {
      if (parent.user?.email) {
        return parent.user;
      }

      return User.findById(parent.user);
    },
    level: async (parent) => {
      const userId = parent.user?._id || parent.user;
      const profile = await GameProfile.findOne({ user: userId });
      return profile ? profile.level : null;
    },
    xp: async (parent) => {
      const userId = parent.user?._id || parent.user;
      const profile = await GameProfile.findOne({ user: userId });
      return profile ? profile.xp : null;
    },
    achievedAt: (parent) => new Date(parent.achievedAt).toISOString()
  },
  Challenge: {
    id: (parent) => String(parent.id || parent._id),
    assignedTo: async (parent) => {
      if (!parent.assignedTo) {
        return null;
      }

      if (parent.assignedTo?.email) {
        return parent.assignedTo;
      }

      return User.findById(parent.assignedTo);
    },
    dueDate: (parent) => (parent.dueDate ? new Date(parent.dueDate).toISOString() : null)
  },
  MatchResult: {
    id: (parent) => String(parent.id || parent._id),
    user: async (parent) => {
      if (parent.user?.email) {
        return parent.user;
      }

      return User.findById(parent.user);
    },
    completedAt: (parent) => new Date(parent.completedAt).toISOString()
  },
  GameActionEvent: {
    id: (parent) => String(parent.id),
    user: async (parent) => {
      if (!parent.user) {
        return null;
      }

      if (parent.user?.email) {
        return parent.user;
      }

      return User.findById(parent.user);
    },
    createdAt: (parent) => new Date(parent.createdAt).toISOString()
  }
};
