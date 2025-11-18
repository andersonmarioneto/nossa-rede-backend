import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";
import { handleError } from "../utils/handleError.js";
import { registerUser, loginUser } from "../services/authService.js";
import { success, error } from "../utils/responseUtil.js";

export async function register(req, res) {
  try {
    const payload = req.body;
    const user = await registerUser(payload);
    return success(res, { message: "Usuário criado", user }, 201);
  } catch (err) {
    return error(res, err.message || "Erro ao registrar", 400);
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser({ email, password });
    return success(res, { message: "Login bem-sucedido", token, user });
  } catch (err) {
    return error(res, err.message || "Erro no login", 400);
  }
}

export async function me(req, res) {
  // requireAuth middleware attaches req.user
  return success(res, { user: req.user });
}
