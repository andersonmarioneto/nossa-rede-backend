import { getConversationsByUser } from "../services/chatService.js";
import { success, error } from "../utils/responseUtil.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createConversationController(req, res) {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    // Check if conversation exists
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: Number(userId) } } },
          { participants: { some: { userId: Number(participantId) } } }
        ]
      }
    });

    if (existing) {
      return res.status(200).json({ status: "success", data: { conversation: existing } });
    }

    // Create new
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: Number(userId) },
            { userId: Number(participantId) }
          ]
        }
      }
    });

    return res.status(201).json({ status: "success", data: { conversation } });
  } catch (err) {
    return res.status(500).json({ status: "error", error: "Erro ao criar conversa" });
  }
}

export async function conversationsByUser(req, res) {
  try {
    const userId = req.user.id;
    const convos = await getConversationsByUser(userId);
    return success(res, { conversations: convos });
  } catch (err) {
    return error(res, err.message || "Erro ao buscar conversas", 400);
  }
}

export async function getConversationByIdController(req, res) {
  try {
    const { id } = req.params;
    const conversation = await prisma.conversation.findUnique({
      where: { id: Number(id) },
      include: {
        participants: {
          include: { user: { select: { id: true, name: true, avatarUrl: true } } }
        }
      }
    });

    if (!conversation) return error(res, "Conversa não encontrada", 404);

    // Verify participation
    const isParticipant = conversation.participants.some(p => p.user.id === req.user.id);
    if (!isParticipant) return error(res, "Acesso negado", 403);

    return success(res, { conversation });
  } catch (err) {
    return error(res, "Erro ao buscar conversa", 500);
  }
}
