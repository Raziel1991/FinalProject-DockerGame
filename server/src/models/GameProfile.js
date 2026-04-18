import mongoose from "mongoose";

const gameProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    reputation: {
      type: Number,
      default: 0
    },
    credits: {
      type: Number,
      default: 0
    },
    currentStage: {
      type: String,
      default: "Dock-01"
    },
    containerHealth: {
      type: Number,
      default: 100
    },
    missionProgress: {
      type: Number,
      default: 0
    },
    missionStatus: {
      type: String,
      default: "Standby"
    },
    unlockedCosmetics: {
      type: [String],
      default: []
    },
    achievements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Achievement"
      }
    ]
  },
  {
    timestamps: true
  }
);

const GameProfile = mongoose.model("GameProfile", gameProfileSchema);

export default GameProfile;
