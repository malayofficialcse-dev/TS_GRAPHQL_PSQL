import  jwt  from "jsonwebtoken";
import { env } from "./env.js";

const SECRET = env.jwtSecret;

export const generateToken = (user: any) => {
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, {
        expiresIn: "7d",
    });
};

export const verifyToken = (token:string) => {
    return jwt.verify(token,SECRET);
};
