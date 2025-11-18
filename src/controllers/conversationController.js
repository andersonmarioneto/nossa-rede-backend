import { getConversationsByUser } from "../services/chatService.js";
import { success, error } from "../utils/responseUtil.js";

export async function conversationsByUser(req, res) {
  try {
    const { userId } = req.params;
    const convos = await getConversationsByUser(userId);
    return success(res, { conversations: convos });
  } catch (err) {
    return error(res, err.message || "Erro ao buscar conversas", 400);
  }
}
