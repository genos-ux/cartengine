import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { generateTokens } from "../utils/token";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", { session: false }, (err:Error, user: Express.User | false, info:any) => {
    if (err || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// Start Google OAuth flow
export const googleAuthMiddleware = passport.authenticate("google", {
  scope: ["profile", "email"],
});

// Handle callback from Google
// export const googleCallbackMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   passport.authenticate("google", { session: false }, (err, user, info) => {
//     if (err || !user) {
//       return res.redirect("/login?error=OAuthFailed"); // or send error JSON
//     }
//     // Here you can generate your JWT tokens and respond
//     // You could also redirect to frontend with tokens via query
//     // req.user = user; // if needed downstream
//     // Generate token logic here or call next middleware
//     // Example:
//     // const token = generateToken(user);
//     // return res.redirect(`https://yourfrontend.com?token=${token}`)

//     const {accessToken,refreshToken}  = generateTokens(user);
//     next();
//   })(req, res, next);
// };

export const googleCallbackMiddleware = (req:Request, res: Response) => {
  const user = req.user!;

  const {accessToken, refreshToken} = generateTokens(user);
}
