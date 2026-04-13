import jwt from "jsonwebtoken";

const defaultSecret = "phase-1-dev-secret";

export function signToken(user) {
  return jwt.sign(
    {
      userId: String(user._id),
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET || defaultSecret,
    {
      expiresIn: "7d"
    }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET || defaultSecret);
}
