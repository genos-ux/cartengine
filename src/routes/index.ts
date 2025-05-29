import { Router } from "express";
import authRoute from "./auth";
import productsRoute from "./products";
import userRoutes from "./users";
import cartRoutes from "./cart";
import orderRoute from "./orders";

const rootRouter:Router = Router();

rootRouter.use('/auth',authRoute);
rootRouter.use('/products',productsRoute);
rootRouter.use('/users',userRoutes);
rootRouter.use('/carts',cartRoutes);
rootRouter.use('/orders/',orderRoute);

export default rootRouter;

/*
    1. user management
    -list users
    - get user by id
    - change user role

    2. order management
    - list all orders ( filter on status)
    - change order status
    -list all orders of given user

    3. products
    a. search api for products (for both users and admins) -> full text search.

*/