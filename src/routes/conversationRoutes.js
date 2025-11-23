import express from "express";
import { createConversationController, conversationsByUser, getConversationByIdController } from "../controllers/conversationController.js";
import { createPrivateConversation } from "../controllers/privateConversationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", conversationsByUser);
router.post("/", createConversationController);
router.post("/private", createPrivateConversation);
router.get("/:id", getConversationByIdController);

export default router;
