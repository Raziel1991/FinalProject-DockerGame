export const typeDefs = `#graphql
  type User {
    id: ID!
    username: String!
    email: String!
    avatarUrl: String
    role: String!
    createdAt: String!
  }

  type GameProfile {
    id: ID!
    user: User!
    level: Int!
    xp: Int!
    totalScore: Int!
    reputation: Int!
    credits: Int!
    currentStage: String!
    unlockedCosmetics: [String!]!
    achievements: [Achievement!]!
  }

  type Achievement {
    id: ID!
    user: User
    key: String!
    title: String!
    description: String!
    xpReward: Int!
    badgeIcon: String!
    completed: Boolean!
    unlockedAt: String
  }

  type LeaderboardEntry {
    id: ID!
    user: User!
    score: Int!
    rank: Int!
    season: String!
    mode: String!
    achievedAt: String!
  }

  type Challenge {
    id: ID!
    assignedTo: User
    title: String!
    description: String!
    type: String!
    rewardXp: Int!
    rewardCredits: Int!
    isActive: Boolean!
    status: String!
    dueDate: String
  }

  type MatchResult {
    id: ID!
    user: User!
    opponentName: String!
    opponentType: String!
    result: String!
    scoreEarned: Int!
    xpEarned: Int!
    completedAt: String!
    notes: String
  }

  type AuthPayload {
    token: String!
    user: User!
    gameProfile: GameProfile
  }

  type DashboardData {
    profile: GameProfile
    achievements: [Achievement!]!
    recentMatches: [MatchResult!]!
    activeChallenges: [Challenge!]!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateGameProfileInput {
    level: Int
    xp: Int
    totalScore: Int
    reputation: Int
    credits: Int
    currentStage: String
    unlockedCosmetics: [String!]
  }

  type Query {
    health: String!
    me: User
    gameProfile: GameProfile
    achievements: [Achievement!]!
    leaderboard: [LeaderboardEntry!]!
    challenges: [Challenge!]!
    recentMatches: [MatchResult!]!
    dashboard: DashboardData!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateMyGameProfile(input: UpdateGameProfileInput!): GameProfile!
  }

  # TODO: Add gameplay mutations and subscriptions in Phase 2 and Phase 3.
`;
