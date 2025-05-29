// utils/token.ts
import jwt from "jsonwebtoken";
import { envDetails } from "../config/secrets";

const {JWT_REFRESH_SECRET, JWT_SECRET_KEY} = envDetails;

export const generateTokens = (user: { id: number }) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
    expiresIn: "30m",
  });

  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: "1h",
  });

  return { accessToken, refreshToken };
};
