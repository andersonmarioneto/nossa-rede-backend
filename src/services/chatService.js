import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getConversationsByUser(userId) {
  const parts = await prisma.participant.findMany({
    where: { userId: Number(userId) },
    include: { conversation: true },
  });
  return parts.map(p => p.conversation);
}

export async function getMessagesByConversation(conversationId) {
  return prisma.message.findMany({
    where: { conversationId: Number(conversationId) },
    include: { sender: { select: { id: true, name: true, username: true, email: true, avatarUrl: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function createMessage({ conversationId, senderId, content, type = "text" }) {
  return prisma.message.create({
    data: {
      conversationId: Number(conversationId),
      senderId: Number(senderId),
      content,
      type,
    },
  });
}
