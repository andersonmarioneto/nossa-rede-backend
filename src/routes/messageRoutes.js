import express from "express";
import { messagesByConversation, createMessageController } from "../controllers/messageController.js";
const router = express.Router();

router.get("/:conversationId", messagesByConversation);
router.post("/", createMessageController);

export default router;
