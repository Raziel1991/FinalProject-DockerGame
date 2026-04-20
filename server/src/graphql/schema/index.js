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
    containerHealth: Int!
    missionProgress: Int!
    missionStatus: String!
    unlockedCosmetics: [String!]!
    achievements: [Achievement!]!
  }

  type GameActionEvent {
    id: ID!
    user: User
    type: String!
    message: String!
    score: Int!
    health: Int!
    createdAt: String!
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
    level: Int
    xp: Int
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
    liveEvents: [GameActionEvent!]!
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
    containerHealth: Int
    missionProgress: Int
    missionStatus: String
    unlockedCosmetics: [String!]
  }

  input SaveGameProgressInput {
    score: Int!
    xp: Int!
    level: Int!
    containerHealth: Int!
    missionProgress: Int!
    missionStatus: String!
    result: String
    scoreEarned: Int
    xpEarned: Int
    notes: String
    challengeId: ID
  }

  input CompleteChallengeInput {
    challengeId: ID!
    score: Int!
    xp: Int!
    level: Int!
    containerHealth: Int!
    missionProgress: Int!
    commandCount: Int!
  }

  type SaveGameProgressPayload {
    profile: GameProfile!
    achievements: [Achievement!]!
    recentMatchResult: MatchResult
    leaderboardEntry: LeaderboardEntry
    liveEvents: [GameActionEvent!]!
  }

  type CompleteChallengePayload {
    profile: GameProfile!
    challenge: Challenge!
    achievements: [Achievement!]!
    recentMatchResult: MatchResult!
    leaderboardEntry: LeaderboardEntry!
    liveEvents: [GameActionEvent!]!
  }

  type Query {
    health: String!
    me: User
    currentUser: User
    profile: UserProfileData
    gameProfile: GameProfile
    achievements: [Achievement!]!
    getAchievements: [Achievement!]!
    leaderboard: [LeaderboardEntry!]!
    getLeaderboard: [LeaderboardEntry!]!
    challenges: [Challenge!]!
    recentMatches: [MatchResult!]!
    liveGameEvents: [GameActionEvent!]!
    dashboard: DashboardData!
  }

  type UserProfileData {
    user: User
    profile: GameProfile
    achievements: [Achievement!]!
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateMyGameProfile(input: UpdateGameProfileInput!): GameProfile!
    saveGameProgress(input: SaveGameProgressInput!): SaveGameProgressPayload!
    completeChallenge(input: CompleteChallengeInput!): CompleteChallengePayload!
    resetMyGameProgress: GameProfile!
    clearMyMatchHistory: Boolean!
  }
`;
