import mongoose from "mongoose";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI in environment variables.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected.");
}
