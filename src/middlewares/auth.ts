import { NextFunction,Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../secrets";
import { prismaClient } from "..";

export const authMiddleware = async(req:Request,res:Response,next:NextFunction) => {
    //Extract the token from header
    const token = req.headers.authorization;
    // If token is not present, thown an error of unauthorized
    if(!token){
        next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        return;
    }
    try {
      // If the token is present, verify that token and extract the payload
      const payload = jwt.verify(token, JWT_SECRET_KEY) as any
      // to get the user from the payload
      const user = await prismaClient.user.findFirst({where: {id: payload.userId}});
      if(!user){
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
      }
      // to attach the user to the current request object
      req.user = user;
      next();
    }catch(error){
        next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
}


