import { FastifyPluginAsync } from "fastify";
import {
  createChat,
  getChat,
  getAllChats,
  addMessage,
  updateChatName,
} from "../../services/chat-store";
import { getProvider, LLMProviderType } from "../../services/llm";

const chatRoutes: FastifyPluginAsync = async (fastify): Promise<void> => {
  // Get all chats
  fastify.get("/", async (request, reply) => {
    const chats = getAllChats();
    return { chats };
  });

  // Create a new chat
  fastify.post("/", async (request, reply) => {
    const chat = createChat();
    return { chat: { id: chat.id, name: chat.name } };
  });

  // Get a specific chat with messages
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const chat = getChat(id);

    if (!chat) {
      return reply.status(404).send({ error: "Chat not found" });
    }

    return { chat };
  });

  // Send a message to a chat
  fastify.post<{
    Params: { id: string };
    Body: { message: string; provider?: LLMProviderType };
  }>("/:id/message", async (request, reply) => {
    const { id } = request.params;
    const { message, provider = "anthropic" } = request.body;

    if (!message || typeof message !== "string") {
      return reply.status(400).send({ error: "Message is required" });
    }

    // Add user message
    let chat = addMessage(id, { role: "user", content: message });
    if (!chat) {
      return reply.status(404).send({ error: "Chat not found" });
    }

    // Update chat name based on first message
    if (chat.messages.length === 1) {
      const name = message.slice(0, 30) + (message.length > 30 ? "..." : "");
      updateChatName(id, name);
    }

    try {
      // Get LLM response using selected provider
      const llmProvider = getProvider(provider);
      const response = await llmProvider.generateResponse(chat.messages);

      // Add assistant message
      chat = addMessage(id, { role: "assistant", content: response });

      return { chat };
    } catch (error) {
      fastify.log.error(error);

      // Extract meaningful error message
      let errorMessage = "Failed to generate response";
      if (error instanceof Error) {
        // Check for common API error patterns
        const message = error.message.toLowerCase();
        if (message.includes("api key") || message.includes("authentication") || message.includes("unauthorized")) {
          errorMessage = `Invalid or missing API key for ${provider}`;
        } else if (message.includes("rate limit") || message.includes("quota") || message.includes("exceeded")) {
          errorMessage = `Rate limit or quota exceeded for ${provider}. Please try again later.`;
        } else if (message.includes("timeout") || message.includes("timed out")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (message.includes("network") || message.includes("connection")) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = error.message;
        }
      }

      return reply.status(500).send({ error: errorMessage });
    }
  });
};

export default chatRoutes;
