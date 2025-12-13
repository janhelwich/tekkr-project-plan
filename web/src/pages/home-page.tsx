import { ChatSidebar } from "../components/chat-sidebar";
import { useEffect, useState } from "react";
import { ChatInputBox } from "../components/chat-input-box";
import { MessageContainer, AssistantLoadingIndicator } from "../components/message";
import { MessageContent } from "../components/message-content";
import {
  useChatsQuery,
  useChatQuery,
  useCreateChatMutation,
  useSendMessageMutation,
} from "../data/queries/chat";
import { Message } from "../data/types";

const SELECTED_CHAT_KEY = "selectedChatId";

export function HomePage() {
  const [chatId, setChatId] = useState<string | null>(() => {
    return localStorage.getItem(SELECTED_CHAT_KEY);
  });

  const { data: chats = [], isLoading: isLoadingChats, isSuccess: chatsLoaded } = useChatsQuery();
  const { data: currentChat, isLoading: isLoadingChat, isError: chatError } = useChatQuery(chatId);
  const createChatMutation = useCreateChatMutation();
  const sendMessageMutation = useSendMessageMutation(chatId);

  // Persist selected chat ID
  useEffect(() => {
    if (chatId) {
      localStorage.setItem(SELECTED_CHAT_KEY, chatId);
    } else {
      localStorage.removeItem(SELECTED_CHAT_KEY);
    }
  }, [chatId]);

  // Clear chatId if it doesn't exist on the server (e.g., after server restart)
  useEffect(() => {
    if (chatId && chatsLoaded && !chats.find((c) => c.id === chatId)) {
      setChatId(null);
    }
  }, [chatId, chats, chatsLoaded]);

  // Also clear if fetching the chat fails (404)
  useEffect(() => {
    if (chatError) {
      setChatId(null);
    }
  }, [chatError]);

  const handleCreateChat = async () => {
    const newChat = await createChatMutation.mutateAsync();
    setChatId(newChat.id);
  };

  const handleSendMessage = async (message: string) => {
    if (!chatId) return;
    await sendMessageMutation.mutateAsync(message);
  };

  const messages = currentChat?.messages ?? [];
  const isLoading = sendMessageMutation.isPending;

  return (
    <div className={"flex flex-col items-center"}>
      <ChatSidebar
        chats={chats}
        selectedChatId={chatId}
        onSelectChat={setChatId}
        onCreateChat={handleCreateChat}
      />
      <div className={"flex flex-col pt-8 max-w-4xl ms-64 w-full"}>
        {chatId ? (
          <ChatWindow
            title={currentChat?.name ?? "Chat"}
            messages={messages}
            isLoading={isLoading}
            onSend={handleSendMessage}
          />
        ) : (
          <EmptyState onCreateChat={handleCreateChat} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ onCreateChat }: { onCreateChat: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-2xl font-semibold mb-2">Welcome to Chat</h2>
      <p className="text-muted-foreground mb-6">
        Start a new conversation to begin chatting with the assistant.
      </p>
      <button
        onClick={onCreateChat}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Start New Chat
      </button>
    </div>
  );
}

function ChatWindow({
  title,
  messages,
  isLoading,
  onSend,
}: {
  title: string;
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
}) {
  return (
    <div className={"flex flex-col gap-4"}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {messages.length === 0 && !isLoading && (
        <p className="text-muted-foreground text-sm">
          Send a message to start the conversation.
        </p>
      )}
      {messages.map((message, index) => (
        <MessageContainer role={message.role} key={index}>
          <MessageContent content={message.content} />
        </MessageContainer>
      ))}
      {isLoading && <AssistantLoadingIndicator />}
      <ChatInputBox onSend={onSend} disabled={isLoading} />
    </div>
  );
}
