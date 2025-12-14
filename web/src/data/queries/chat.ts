import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../client";
import { Chat, ChatReference, LLMProvider } from "../types";

export function useChatsQuery() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await apiClient.get("/chat");
      if (response.status !== 200) {
        throw new Error("Failed to fetch chats");
      }
      return response.data.chats as ChatReference[];
    },
  });
}

export function useChatQuery(chatId: string | null) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const response = await apiClient.get(`/chat/${chatId}`);
      if (response.status !== 200) {
        throw new Error("Failed to fetch chat");
      }
      return response.data.chat as Chat;
    },
    enabled: !!chatId,
  });
}

export function useCreateChatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/chat");
      if (response.status !== 200) {
        throw new Error("Failed to create chat");
      }
      return response.data.chat as ChatReference;
    },
    onSuccess: (newChat) => {
      // Optimistically add the new chat to the cache immediately
      queryClient.setQueryData<ChatReference[]>(["chats"], (old) => {
        return old ? [newChat, ...old] : [newChat];
      });
    },
  });
}

export function useSendMessageMutation(chatId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, provider }: { message: string; provider: LLMProvider }) => {
      if (!chatId) throw new Error("No chat selected");
      const response = await apiClient.post(`/chat/${chatId}/message`, {
        message,
        provider,
      });
      if (response.status !== 200) {
        throw new Error("Failed to send message");
      }
      return response.data.chat as Chat;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
