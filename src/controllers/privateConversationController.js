import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function createPrivateConversation(req, res) {
    try {
        const { userId1, userId2 } = req.body;

        if (!userId1 || !userId2) {
            return res.status(400).json({ error: "IDs obrigatórios" });
        }

        // verificar se já existe conversa privada
        const existing = await prisma.conversation.findFirst({
            where: {
                participants: {
                    every: {
                        userId: { in: [userId1, userId2] }
                    }
                }
            },
            include: { participants: true }
        });

        if (existing) {
            return res.json({ success: true, conversation: existing });
        }

        // caso não exista, criar nova
        const conversation = await prisma.conversation.create({
            data: {
                title: null,
                participants: {
                    create: [
                        { userId: userId1 },
                        { userId: userId2 }
                    ]
                }
            },
            include: { participants: true }
        });

        return res.json({ success: true, conversation });

    } catch (error) {
        res.status(500).json({ error: "Erro ao criar conversa" });
    }
}
