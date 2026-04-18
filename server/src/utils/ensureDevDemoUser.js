import bcrypt from "bcryptjs";
import User from "../models/User.js";
import GameProfile from "../models/GameProfile.js";

const DEV_DEMO_EMAIL = "demo@dockerops.com";
const DEV_DEMO_PASSWORD = "Demo123!";
const DEV_DEMO_USERNAME = "dockerCadet";
const EXTRA_DEMO_USERS = [
  {
    username: "stackCaptain",
    email: "stackCaptain@example.com"
  },
  {
    username: "portMapper",
    email: "portMapper@example.com"
  },
  {
    username: "yamlWizard",
    email: "yamlWizard@example.com"
  }
];

export async function ensureDevDemoUser() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const hashedPassword = await bcrypt.hash(DEV_DEMO_PASSWORD, 10);

  const user = await User.findOneAndUpdate(
    { email: DEV_DEMO_EMAIL },
    {
      $set: {
        username: DEV_DEMO_USERNAME,
        password: hashedPassword,
        role: "player"
      },
      $setOnInsert: {
        avatarUrl: ""
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  for (const demoUser of EXTRA_DEMO_USERS) {
    await User.findOneAndUpdate(
      { email: demoUser.email },
      {
        $set: {
          username: demoUser.username,
          password: hashedPassword,
          role: "player"
        },
        $setOnInsert: {
          avatarUrl: ""
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  }

  await GameProfile.findOneAndUpdate(
    { user: user._id },
    {
      $setOnInsert: {
        user: user._id,
        level: 3,
        xp: 340,
        totalScore: 1250,
        reputation: 0,
        credits: 0,
        currentStage: "Dock-01",
        containerHealth: 84,
        missionProgress: 0,
        missionStatus: "Standby",
        unlockedCosmetics: []
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  console.log(`Development demo user ready: ${DEV_DEMO_EMAIL}`);
}
