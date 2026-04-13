import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      default: "daily"
    },
    rewardXp: {
      type: Number,
      default: 50
    },
    rewardCredits: {
      type: Number,
      default: 25
    },
    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: "available"
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;
