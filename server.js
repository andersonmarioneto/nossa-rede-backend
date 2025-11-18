import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import conversationRoutes from "./src/routes/conversationRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

const app = express();
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
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
