// utils/token.ts
import jwt from "jsonwebtoken";
import {
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../secrets";

export const generateTokens = (user: { id: number }) => {
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, {
    expiresIn: '30m'
  });

  const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, {
    expiresIn: '1h'
  });

  return { accessToken, refreshToken };
};
