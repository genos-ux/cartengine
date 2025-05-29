import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prismaClient } from "..";
import { envDetails } from "./secrets";

const {GOOGLE_CALLBACK_URL,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET} = envDetails;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email)
          return done(new Error("Email not provided by Google"), false);

        let user = await prismaClient.user.findUnique({ where: { email } });

        if (!user) {
          user = await prismaClient.user.create({
            data: {
              email,
              name: profile.displayName,
              password: "",
              role: "USER",
              provider: "google",
              //   avatar: profile.photos?.[0].value || undefined,
              // You can set a role or any other defaults here
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
