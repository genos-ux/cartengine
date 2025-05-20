import { Router } from "express";
import { login } from "../controllers/auth";

const authRoute:Router = Router();

authRoute.get('/login', login);

export default authRoute;