import { aj } from "../lib/arcjet";
import { Request,Response,NextFunction } from "express";

export const arcjetMiddleware = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each  request consumes 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({
          error: "Too many Requests",
        });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ error: "Spoofed bot detected." });
      return;
    }

    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
};
