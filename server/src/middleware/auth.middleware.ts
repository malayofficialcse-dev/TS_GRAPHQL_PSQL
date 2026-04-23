import { verifyToken } from "../config/jwt";

export const authMiddleware = (req: any) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) return null;

  try {
    const decoded = verifyToken(token);
    return decoded;
  } catch (err) {
    return null;
  }
};