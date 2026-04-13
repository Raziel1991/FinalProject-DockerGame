import mongoose from "mongoose";

const matchResultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    opponentName: {
      type: String,
      required: true,
      trim: true
    },
    opponentType: {
      type: String,
      default: "ai"
    },
    result: {
      type: String,
      default: "win"
    },
    scoreEarned: {
      type: Number,
      default: 0
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

const MatchResult = mongoose.model("MatchResult", matchResultSchema);

export default MatchResult;
