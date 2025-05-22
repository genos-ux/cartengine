import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/notFound";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedUser = SignupSchema.parse(req.body);

//   const { email, password, name } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email: validatedUser.email } });

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
    },
  });
  res.json('User successfully created.');
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND);

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);
  }

  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET_KEY);

  res.json({ user, accessToken });
};

// /me -> return the logged in user

export const me = async(req:Request,res:Response) => {
    return res.json(req.user);
}