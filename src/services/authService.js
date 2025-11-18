import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function registerUser({ name, username, email, password }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new Error("Email já cadastrado.");

  // optionally check username unique if provided
  if (username) {
    const u = await prisma.user.findUnique({ where: { username } });
    if (u) throw new Error("Username já em uso.");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, username: username || null, email, password: hashed },
  });
  const { password: p, ...userSafe } = user;
  return userSafe;
}

export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado, Email incorreto.");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Senha incorreta.");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
  const { password: p, ...userSafe } = user;
  return { token, user: userSafe };
}
