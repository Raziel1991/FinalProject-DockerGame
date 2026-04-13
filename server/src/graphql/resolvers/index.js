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
  placeholderLeaderboard,
  placeholderMatches
} from "../../utils/placeholderData.js";

function requireAuth(currentUser) {
  if (!currentUser) {
    throw new GraphQLError("Authentication required.", {
      extensions: { code: "UNAUTHENTICATED" }
    });
  }
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
    leaderboard: async () => {
      const entries = await LeaderboardEntry.find()
        .populate("user")
        .sort({ score: -1, achievedAt: 1 })
        .limit(10);

      return entries.length > 0 ? entries : placeholderLeaderboard;
    },
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
    dashboard: async (_, __, { currentUser }) => {
      if (!currentUser) {
        return {
          profile: null,
          achievements: placeholderAchievements,
          recentMatches: placeholderMatches,
          activeChallenges: placeholderChallenges
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
        activeChallenges: challenges.length > 0 ? challenges : placeholderChallenges
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
  }
};
