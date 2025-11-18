import express from "express";
import { conversationsByUser } from "../controllers/conversationController.js";
const router = express.Router();

router.get("/:userId", conversationsByUser);

export default router;
