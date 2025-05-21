import { Router } from "express";
import { login, signup } from "../controllers/auth";
import { errorHandler } from "../errorHandler";

const authRoute:Router = Router();

authRoute.post('/signup', errorHandler(signup));

authRoute.post('/login', errorHandler(login));

export default authRoute;