import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { PrismaClient } from "./generated/prisma";
import { errorMiddleware } from "./middlewares/errors";
import { SignupSchema } from "./schema/users";


const app: Express = express();

app.use(express.json());

app.use(errorMiddleware);

app.use('/api',rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query']
})

app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
