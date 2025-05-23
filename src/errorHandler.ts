import { NextFunction, Request, Response } from "express"
import { ErrorCode, HttpException } from "./exceptions/root"
import { InternalException } from "./exceptions/internalException"
import { ZodError } from "zod"
import { BadRequestsException } from "./exceptions/bad-requests"

export const errorHandler = (method: Function) => {
    return async(req:Request, res:Response, next: NextFunction) => {
        try{
            await method(req,res,next)

        }catch(error:any){
            let exception: HttpException;
            if(error instanceof HttpException){
                exception = error;
            }
            else{
                if (error instanceof ZodError) {
                  console.error("Zod Validation Error:", error.errors);

                  const detailedMessage = error.errors
                    .map((e) => `${e.path.join(".")} - ${e.message}`)
                    .join("; ");

                  exception = new BadRequestsException(
                    `Validation failed: ${detailedMessage}`, // 👈 include field-level messages
                    ErrorCode.UNPROCESSABLE_ENTITY
                  );
                }
                else{
                    exception = new InternalException(
                      "Something went wrong!",
                      error,
                      ErrorCode.INTERNAL_EXCEPTION
                    );

                }
                
            }
            next(exception);

        }

    }
}