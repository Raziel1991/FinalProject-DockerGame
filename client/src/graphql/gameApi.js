import { gql } from "@apollo/client";
import { graphqlClient } from "./client";
import { getMockAchievements } from "../services/mockGameService";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      username
      email
    }
  }
`;

const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      profile {
        id
        level
        xp
        totalScore
        credits
        currentStage
        containerHealth
        missionProgress
        missionStatus
      }
      achievements {
        id
        key
        title
        description
        completed
      }
      recentMatches {
        id
        result
        scoreEarned
        xpEarned
        completedAt
        notes
      }
      activeChallenges {
        id
        title
        description
        rewardXp
        rewardCredits
        status
      }
      liveEvents {
        id
        type
        message
        score
        health
        createdAt
      }
    }
  }
`;

const PROFILE_QUERY = gql`
  query Profile {
    profile {
      user {
        id
        username
        email
        role
      }
      profile {
        id
        level
        xp
        totalScore
        credits
        currentStage
        unlockedCosmetics
      }
      achievements {
        id
        key
        title
        description
        completed
      }
    }
  }
`;

const GET_ACHIEVEMENTS_QUERY = gql`
  query GetAchievements {
    getAchievements {
      id
      key
      title
      description
      completed
    }
  }
`;

const GET_CHALLENGES_QUERY = gql`
  query GetChallenges {
    challenges {
      id
      title
      description
      type
      rewardXp
      rewardCredits
      status
    }
  }
`;

const LIVE_GAME_EVENTS_QUERY = gql`
  query LiveGameEvents {
    liveGameEvents {
      id
      type
      message
      score
      health
      createdAt
    }
  }
`;

const GET_LEADERBOARD_QUERY = gql`
  query GetLeaderboard {
    getLeaderboard {
      id
      rank
      level
      xp
      score
      mode
      user {
        id
        username
      }
    }
  }
`;

const SAVE_GAME_PROGRESS_MUTATION = gql`
  mutation SaveGameProgress($input: SaveGameProgressInput!) {
    saveGameProgress(input: $input) {
      profile {
        id
        level
        xp
        totalScore
        containerHealth
        missionProgress
        missionStatus
      }
      achievements {
        id
        key
        title
        description
        completed
      }
      recentMatchResult {
        id
        result
        scoreEarned
        xpEarned
        notes
      }
      leaderboardEntry {
        id
        rank
        score
      }
      liveEvents {
        id
        type
        message
        score
        health
        createdAt
      }
    }
  }
`;

const COMPLETE_CHALLENGE_MUTATION = gql`
  mutation CompleteChallenge($input: CompleteChallengeInput!) {
    completeChallenge(input: $input) {
      profile {
        id
        level
        xp
        totalScore
        credits
        containerHealth
        missionProgress
        missionStatus
        unlockedCosmetics
      }
      challenge {
        id
        title
        status
      }
      recentMatchResult {
        id
        result
        scoreEarned
        xpEarned
        notes
      }
      leaderboardEntry {
        id
        rank
        score
      }
      liveEvents {
        id
        type
        message
        score
        health
        createdAt
      }
    }
  }
`;

const RESET_PROGRESS_MUTATION = gql`
  mutation ResetMyGameProgress {
    resetMyGameProgress {
      id
      level
      xp
      totalScore
      credits
      currentStage
      containerHealth
      missionProgress
      missionStatus
      unlockedCosmetics
    }
  }
`;

const CLEAR_MATCH_HISTORY_MUTATION = gql`
  mutation ClearMyMatchHistory {
    clearMyMatchHistory
  }
`;

export async function getCurrentUser() {
  try {
    const { data } = await graphqlClient.query({
      query: CURRENT_USER_QUERY,
      fetchPolicy: "network-only"
    });

    return data.currentUser;
  } catch {
    return null;
  }
}

export async function getAchievements() {
  try {
    const { data } = await graphqlClient.query({
      query: GET_ACHIEVEMENTS_QUERY,
      fetchPolicy: "network-only"
    });

    return data.getAchievements.map((achievement) => ({
      key: achievement.key,
      title: achievement.title,
      description: achievement.description,
      unlocked: achievement.completed
    }));
  } catch {
    return getMockAchievements();
  }
}

export async function getChallenges() {
  try {
    const { data } = await graphqlClient.query({
      query: GET_CHALLENGES_QUERY,
      fetchPolicy: "network-only"
    });

    return data.challenges || [];
  } catch {
    return [];
  }
}

export async function getLiveGameEvents() {
  try {
    const { data } = await graphqlClient.query({
      query: LIVE_GAME_EVENTS_QUERY,
      fetchPolicy: "network-only"
    });

    return data.liveGameEvents || [];
  } catch {
    return [];
  }
}

export async function getLeaderboard() {
  try {
    const { data } = await graphqlClient.query({
      query: GET_LEADERBOARD_QUERY,
      fetchPolicy: "network-only"
    });

    if (!data.getLeaderboard?.length) {
      return [];
    }

    return data.getLeaderboard.map((entry) => ({
      rank: entry.rank,
      player: entry.user.username,
      level: entry.level,
      xp: entry.xp,
      score: entry.score,
      status: entry.mode
    }));
  } catch {
    return [];
  }
}

export async function saveGameProgress(gameState) {
  try {
    const { data } = await graphqlClient.mutate({
      mutation: SAVE_GAME_PROGRESS_MUTATION,
      variables: {
        input: {
          score: gameState.score,
          xp: gameState.xp,
          level: gameState.level,
          containerHealth: gameState.containerHealth,
          missionProgress: gameState.missionProgress,
          missionStatus: gameState.missionStatus,
          result: gameState.recentMatchResult.result,
          scoreEarned: gameState.recentMatchResult.scoreEarned,
          xpEarned: gameState.recentMatchResult.xpEarned,
          notes: gameState.recentMatchResult.summary,
          challengeId: gameState.challengeId || null
        }
      }
    });

    return data.saveGameProgress;
  } catch {
    return null;
  }
}

export async function completeChallenge(gameState) {
  try {
    const { data } = await graphqlClient.mutate({
      mutation: COMPLETE_CHALLENGE_MUTATION,
      variables: {
        input: {
          challengeId: gameState.challengeId,
          score: gameState.score,
          xp: gameState.xp,
          level: gameState.level,
          containerHealth: gameState.containerHealth,
          missionProgress: gameState.missionProgress,
          commandCount: gameState.commandCount
        }
      }
    });

    return data.completeChallenge;
  } catch {
    return null;
  }
}

export async function resetGameProgress() {
  try {
    const { data } = await graphqlClient.mutate({
      mutation: RESET_PROGRESS_MUTATION
    });

    return data.resetMyGameProgress;
  } catch {
    return null;
  }
}

export async function clearMatchHistory() {
  try {
    const { data } = await graphqlClient.mutate({
      mutation: CLEAR_MATCH_HISTORY_MUTATION
    });

    return Boolean(data.clearMyMatchHistory);
  } catch {
    return false;
  }
}

export async function getDashboardData() {
  try {
    const { data } = await graphqlClient.query({
      query: DASHBOARD_QUERY,
      fetchPolicy: "network-only"
    });

    return data.dashboard;
  } catch {
    return null;
  }
}

export async function getProfileData() {
  try {
    const { data } = await graphqlClient.query({
      query: PROFILE_QUERY,
      fetchPolicy: "network-only"
    });

    return data.profile;
  } catch {
    return null;
  }
}
