import express from "express";
import { messagesByConversation, createMessageController } from "../controllers/messageController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/:conversationId", requireAuth, messagesByConversation);
router.post("/", requireAuth, createMessageController);

export default router;
