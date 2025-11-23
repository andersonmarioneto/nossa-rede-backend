import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import conversationRoutes from "./src/routes/conversationRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("join_conversation", (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`Socket ${socket.id} entrou na sala conversation_${conversationId}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

//app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Rotas
app.use("/auth", authRoutes);        // /auth/login  /auth/register
app.use("/", profileRoutes);         // /users/:id  /auth/me  (ok agrupar assim)
app.use("/conversations", conversationRoutes); // GET /conversations/:userId
app.use("/messages", messageRoutes);       // GET /messages/:conversationId, POST /messages

// 
app.get("/", (req, res) => {
  res.json({ message: "API Nossa.Rede funcionando!" });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
