import User from "../models/User.js";
import { verifyToken } from "../utils/jwt.js";

export async function getCurrentUser(authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  try {
    const payload = verifyToken(token);
    return await User.findById(payload.userId);
  } catch {
    return null;
  }
}
