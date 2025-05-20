import { Router } from "express";
import { signup } from "../controllers/auth";

const authRoute:Router = Router();

authRoute.post('/signup', signup);

export default authRoute;