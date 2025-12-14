import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { apiClient } from "../client";
import { Chat, ChatReference, LLMProvider } from "../types";

// Helper to extract error message from API response
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

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
      try {
        const response = await apiClient.post("/chat");
        if (response.status !== 200) {
          throw new Error("Failed to create chat");
        }
        return response.data.chat as ChatReference;
      } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to create chat"));
      }
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
      try {
        const response = await apiClient.post(`/chat/${chatId}/message`, {
          message,
          provider,
        });
        if (response.status !== 200) {
          throw new Error("Failed to send message");
        }
        return response.data.chat as Chat;
      } catch (error) {
        throw new Error(getErrorMessage(error, "Failed to send message"));
      }
    },
    onMutate: async ({ message }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["chat", chatId] });

      // Snapshot the previous value
      const previousChat = queryClient.getQueryData<Chat>(["chat", chatId]);

      // Optimistically update with user message
      if (previousChat) {
        queryClient.setQueryData<Chat>(["chat", chatId], {
          ...previousChat,
          messages: [...previousChat.messages, { role: "user", content: message }],
        });
      }

      return { previousChat };
    },
    onError: (_error, _variables, context) => {
      // Rollback to previous state on error
      if (context?.previousChat) {
        queryClient.setQueryData(["chat", chatId], context.previousChat);
      }
    },
    onSuccess: (newChat) => {
      // Update with the full response including assistant message
      queryClient.setQueryData(["chat", chatId], newChat);
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
