import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "minha_chave_super_secreta";

export async function registerUser(name, email, password) {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error("Email já cadastrado.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { message: "Usuário cadastrado com sucesso!", user };
}

export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado.");

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error("Senha incorreta.");

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    message: "Login bem-sucedido!",
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}
