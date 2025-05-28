import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../secrets";
import { prismaClient } from "..";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value || "";

        let user = await prismaClient.user.findUnique({ where: { email } });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              email,
              name: profile.displayName,
              password: '', 
              role: 'USER',
              provider: 'google'
            //   avatar: profile.photos?.[0].value || undefined,
              // You can set a role or any other defaults here
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
