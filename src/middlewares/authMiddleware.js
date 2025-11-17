// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: "Token não fornecido." });

    const payload = jwt.verify(token, jwtSecret);
    // payload deve conter { id: userId } conforme login
    req.userId = payload.id;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
