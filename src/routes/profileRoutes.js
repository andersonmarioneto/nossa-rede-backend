// src/routes/profileRoutes.js
import express from "express";
import { getPublicProfile, getMyProfile, updateMyProfile } from "../controllers/profileController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * GET /users/:id    -> perfil público
 * GET /auth/me      -> perfil do utilizador autenticado
 * PUT /auth/me      -> atualizar perfil (autenticado)
 */
router.get("/users/:id", getPublicProfile);/* 
router.get("/auth/me", authMiddleware, getMyProfile);
router.put("/auth/me", authMiddleware, updateMyProfile); */

export default router;
