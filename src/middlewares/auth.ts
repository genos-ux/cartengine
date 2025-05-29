import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: Error, user: Express.User | false, info: any) => {
      if (err || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};

// Start Google OAuth flow
export const googleAuthMiddleware = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const googleCallbackMiddleware = (req: Request, res:Response, next:NextFunction) => {
  passport.authenticate("google", { session: false }, (err:Error, user:Express.User,info:any) => {
    if (err || !user) return res.redirect("/login?error=OAuthFailed");

    req.user = user;
    next();
  })(req, res, next);
};