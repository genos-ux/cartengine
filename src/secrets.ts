import dotenv from 'dotenv';

dotenv.config({path: '.env'});

export const PORT = process.env.PORT
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN