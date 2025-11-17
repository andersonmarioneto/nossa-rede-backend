// src/controllers/profileController.js
import prisma from "../config/db.js";
import { handleError } from "../utils/handleError.js";

export const getPublicProfile = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!userId) return res.status(400).json({ error: "ID inválido." });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: false,      // não retornar email no perfil público
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

    return res.json({ user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Utilizador não encontrado." });

    return res.json({ user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const { name, username, bio, avatarUrl } = req.body;

    // validação simples (podes expandir)
    if (username && typeof username !== "string") {
      return res.status(400).json({ error: "username inválido." });
    }

    // evita duplicar username (se foi alterado)
    if (username) {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== userId) {
        return res.status(400).json({ error: "Username já em uso." });
      }
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name ?? undefined,
        username: username ?? undefined,
        bio: bio ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    });

    return res.json({ message: "Perfil atualizado.", user: updated });
  } catch (error) {
    return handleError(res, error);
  }
};
