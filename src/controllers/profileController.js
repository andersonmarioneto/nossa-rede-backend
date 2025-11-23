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
        coverUrl: true,
        bio: true,
        status: true,
        socialLinks: true,
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
        coverUrl: true,
        bio: true,
        status: true,
        socialLinks: true,
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
    const { name, username, bio, status, socialLinks } = req.body;

    // Processar arquivos enviados
    let avatarUrl = undefined;
    let coverUrl = undefined;
    const baseUrl = process.env.BASE_URL || "http://localhost:4000"; // Ajuste conforme env

    if (req.files) {
      if (req.files.avatar) {
        avatarUrl = `${baseUrl}/uploads/${req.files.avatar[0].filename}`;
      }
      if (req.files.cover) {
        coverUrl = `${baseUrl}/uploads/${req.files.cover[0].filename}`;
      }
    }

    // Se o usuário enviou URL de texto (legado ou externo), usamos ela se não houver arquivo novo
    // Mas o frontend agora vai priorizar o arquivo.
    // Se quiser manter suporte a URL direta via texto, pode verificar req.body.avatarUrl também.

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
        coverUrl: coverUrl ?? undefined,
        status: status ?? undefined,
        socialLinks: socialLinks ?? undefined,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatarUrl: true,
        coverUrl: true,
        bio: true,
        status: true,
        socialLinks: true,
        createdAt: true,
      },
    });

    return res.json({ message: "Perfil atualizado.", user: updated });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = Number(req.userId);
    const users = await prisma.user.findMany({
      where: {
        id: {
          not: userId, // Exclui o próprio usuário
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        status: true,
      },
    });
    res.json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
};
