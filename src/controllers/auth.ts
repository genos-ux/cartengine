import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
// import {
//   JWT_EXPIRES_IN,
//   JWT_REFRESH_EXPIRES_IN,
//   JWT_REFRESH_SECRET,
//   JWT_SECRET_KEY,
// } from "../config/secrets";
import { envDetails } from "../config/secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";
import { Role } from "../generated/prisma";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { generateTokens } from "../utils/token";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUser = SignupSchema.parse(req.body);

  let user = await prismaClient.user.findFirst({
    where: { email: validatedUser.email },
  });

  if (user)
    new BadRequestsException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );

  user = await prismaClient.user.create({
    data: {
      name: validatedUser.name,
      email: validatedUser.email,
      password: hashSync(validatedUser.password, 10),
      role: validatedUser.role as Role,
      provider: "local",
    },
  });
  res.json("User successfully created.");
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user || !user.password || user.provider === "google")
    throw new NotFoundException("User not found.", ErrorCode.USER_NOT_FOUND);

  const isPasswordCorrect = compareSync(password, user.password);

  if (!isPasswordCorrect) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }

  const { accessToken, refreshToken } = generateTokens(user);

  await prismaClient.userRefreshTokens.create({
    data: {
      refreshToken,
      userId: user.id,
    },
  });

  return res.status(200).json({
    id: user.id,
    name: user.name,
    role: user.role,
    accessToken,
    refreshToken,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const {JWT_REFRESH_SECRET, JWT_SECRET_KEY} = envDetails;
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found." });
    }

    const decodedRefreshToken = jwt.verify(
      refreshToken,
      JWT_REFRESH_SECRET
    ) as jwt.JwtPayload;

    const userRefreshToken =
      await prismaClient.userRefreshTokens.findFirstOrThrow({
        where: {
          refreshToken,
          userId: decodedRefreshToken.userId,
        },
      });

    await prismaClient.userRefreshTokens.delete({
      where: {
        id: userRefreshToken.id,
      },
    });

    const accessToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      JWT_SECRET_KEY,
      {
        subject: "accessToken",
        expiresIn: "30s",
      }
    );

    const newRefreshToken = jwt.sign(
      { userId: decodedRefreshToken.userId },
      JWT_REFRESH_SECRET,
      {
        subject: "refreshToken",
        expiresIn: "2m",
      }
    );

    await prismaClient.userRefreshTokens.create({
      data: {
        refreshToken: newRefreshToken,
        userId: decodedRefreshToken.userId,
      },
    });

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    throw new UnauthorizedException(
      "Refresh token invalid or expired",
      ErrorCode.UNAUTHORIZED
    );
  }
};

export const googleCallbackController = async (req: Request, res: Response) => {
  const user = req.user!;
  const { accessToken, refreshToken } = generateTokens(user);

  await prismaClient.userRefreshTokens.create({
    data: {
      refreshToken,
      userId: user.id,
    },
  });
  // frontend route later
  // res.redirect(`https://yourfrontend.com?accessToken=${accessToken}`);
  res.json({
    message: "Google authentication successful",
    accessToken,
    refreshToken,
    user,
  });
};

export const discordCallbackController = async(req: Request, res:Response) => {
  const user = req.user!;
  const {accessToken, refreshToken} = generateTokens(user);

  await prismaClient.userRefreshTokens.create({
    data: {
      refreshToken,
      userId: req.user!.id
    }
  })

  res.json({
    message: "Discord authentication successful",
    accessToken,
    refreshToken,
    user
  })
}

// /me -> return the logged in user

export const me = async (req: Request, res: Response) => {
  return res.json(req.user);
};
