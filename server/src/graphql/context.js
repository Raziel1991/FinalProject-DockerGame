import { getCurrentUser } from "../middleware/auth.js";

export async function buildContext(req) {
  const authorization = req.headers.authorization || "";
  const currentUser = await getCurrentUser(authorization);

  return {
    currentUser
  };
}
