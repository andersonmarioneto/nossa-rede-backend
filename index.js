import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// rota padão inicial
app.get("/", (req, res) => {
  res.json({ message: "API do chat funcionando!" });
});

// Criar usuário
app.post("/users", async (req, res) => {
  const { name, username, email, password } = req.body;
  const user = await prisma.user.create({
    data: { name, username, email, password },
  });
  res.json(user);
});

// Criar conversa
app.post("/conversations", async (req, res) => {
  const { title, participantIds } = req.body;

  const conversation = await prisma.conversation.create({
    data: {
      title,
      participants: {
        create: participantIds.map((id) => ({ userId: id })),
      },
    },
    include: { participants: true },
  });

  res.json(conversation);
});

// Enviar mensagem
app.post("/messages", async (req, res) => {
  const { conversationId, senderId, content, type } = req.body;
  const message = await prisma.message.create({
    data: { conversationId, senderId, content, type },
  });
  res.json(message);
});

// Listar mensagens de uma conversa
app.get("/messages/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const messages = await prisma.message.findMany({
    where: { conversationId: parseInt(conversationId) },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(messages);
});

// Listar conversas de um usuário
app.get("/conversations/:userId", async (req, res) => {
  const { userId } = req.params;
  const conversations = await prisma.participant.findMany({
    where: { userId: parseInt(userId) },
    include: { conversation: true },
  });
  res.json(conversations.map((p) => p.conversation));
});

app.listen(3001, () => console.log("🚀 Backend rodando na porta 3001"));
