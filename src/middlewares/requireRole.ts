import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import { Role } from "../generated/prisma";

export const isAuthorised = (roles:Role[]) => {
    return async(req: Request, res: Response, next:NextFunction) => {
        const user = await prismaClient.user.findFirst({
            where: {
                id: req.user?.id
            }
        })

        if(roles?.includes(user?.role!)){
            next();
        }else{
            next(new UnauthorizedException('Unauthorized', ErrorCode.UNAUTHORIZED));
        }


    }
}
