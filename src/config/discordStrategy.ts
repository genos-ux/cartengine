import passport from "passport";
// import { Strategy as DiscordStrategy } from "passport-discord";
import {Strategy as DiscordStrategy} from "passport-discord";
import { prismaClient } from "..";
import { envDetails } from "./secrets";

const {DISCORD_CALLBACK_URL,DISCORD_CLIENT_ID,DISCORD_CLIENT_SECRET} = envDetails;

passport.use(
  new DiscordStrategy(
    {
      clientID: DISCORD_CLIENT_ID!,
      clientSecret: DISCORD_CLIENT_SECRET!,
      callbackURL: DISCORD_CALLBACK_URL!,
      scope: ["identify", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("DISCORD PROFILE:", profile);
        const email = profile.email!;
        let user = await prismaClient.user.findUnique({ where: { email } });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              email,
              name: profile.username,
              password: "",
              role: "USER",
              provider: "discord",
              // optionally avatar: profile.avatar
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
