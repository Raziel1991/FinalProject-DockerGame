import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    key: {
      type: String,
      required: true,
      trim: true
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
    xpReward: {
      type: Number,
      default: 0
    },
    badgeIcon: {
      type: String,
      default: "anchor"
    },
    completed: {
      type: Boolean,
      default: false
    },
    unlockedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
