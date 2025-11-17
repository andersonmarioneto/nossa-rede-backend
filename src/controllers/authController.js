import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../config/jwt.js";
import { handleError } from "../utils/handleError.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "E-mail já cadastrado." });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return res.json({ message: "Conta criada com sucesso!", user });
  } catch (error) {
    handleError(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "E-mail não encontrado." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "7d" });

    return res.json({ message: "Login realizado!", token, user });
  } catch (error) {
    handleError(res, error);
  }
};