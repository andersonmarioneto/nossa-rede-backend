// src/routes/profileRoutes.js
import express from "express";
import { getPublicProfile, getMyProfile, updateMyProfile, getAllUsers } from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * GET /users/:id    -> perfil público
 * GET /auth/me      -> perfil do utilizador autenticado
 * PUT /auth/me      -> atualizar perfil (autenticado)
 */
router.get("/users", requireAuth, getAllUsers);
router.get("/users/:id", getPublicProfile);
router.get("/auth/me", requireAuth, getMyProfile);
router.put("/auth/me", requireAuth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), updateMyProfile);

export default router;
