import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);        // /auth/login  /auth/register
app.use("/", profileRoutes);         // /users/:id  /auth/me  (ok agrupar assim)

app.get("/", (req, res) => {
  res.json({ message: "API Nossa.Rede funcionando!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


