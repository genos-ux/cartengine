import express, { Express, Request, Response } from "express";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma";
import { errorMiddleware } from "./middlewares/errors";
import passport from "./config/passport";
import { envDetails } from "./config/secrets";
import "./config/googleStrategy";
import "./config/discordStrategy";
import { arcjetMiddleware } from "./middlewares/arcjet";

const app: Express = express();

const {PORT} = envDetails;

app.use(express.json());

app.use(errorMiddleware);

app.use(passport.initialize());

// apply arcjet rate-limit to all routes
app.use(arcjetMiddleware);

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true,
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}, ${addr.pincode}`;
        },
      },
    },
  },
});

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
