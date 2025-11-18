// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ status: "error", error: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // attach user to request (fetch from DB to ensure fresh)
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ status: "error", error: "Invalid token" });

    // remove sensitive field
    const { password, ...userSafe } = user;
    req.user = userSafe;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", error: "Invalid or expired token" });
  }
}
