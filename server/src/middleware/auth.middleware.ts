import { verify } from "jsonwebtoken";
import { verifyToken } from "../config/jwt";

export const authMiddleware = (req:any) => {
    const token = req.headers.authorization || "";

    if(!token) throw new Error("Unauthoriszed");

    const decode = verifyToken(token);
    return decode;
}