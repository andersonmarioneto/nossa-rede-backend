import { getMessagesByConversation, createMessage } from "../services/chatService.js";
import { success, error } from "../utils/responseUtil.js";

export async function messagesByConversation(req, res) {
  try {
    const { conversationId } = req.params;
    const messages = await getMessagesByConversation(conversationId);
    return success(res, { messages });
  } catch (err) {
    return error(res, err.message || "Erro ao buscar mensagens", 400);
  }
}

export async function createMessageController(req, res) {
  try {
    const { conversationId, content, type } = req.body;
    const senderId = req.user.id;
    const message = await createMessage({ conversationId, senderId, content, type });

    const io = req.app.get("io");
    io.to(`conversation_${conversationId}`).emit("new_message", message);

    return success(res, { message }, 201);
  } catch (err) {
    return error(res, err.message || "Erro ao criar mensagem", 400);
  }
}
