import { Chat, ChatReference, Message } from "../domain/chat";

const chats = new Map<string, Chat>();

let chatCounter = 0;

function generateId(): string {
  return `chat_${++chatCounter}_${Date.now()}`;
}

export function createChat(): Chat {
  const id = generateId();
  const chat: Chat = {
    id,
    name: `Chat ${chatCounter}`,
    messages: [],
    createdAt: new Date(),
  };
  chats.set(id, chat);
  return chat;
}

export function getChat(id: string): Chat | undefined {
  return chats.get(id);
}

export function getAllChats(): ChatReference[] {
  return Array.from(chats.values())
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map((chat) => ({ id: chat.id, name: chat.name }));
}

export function addMessage(chatId: string, message: Message): Chat | undefined {
  const chat = chats.get(chatId);
  if (!chat) return undefined;
  chat.messages.push(message);
  return chat;
}

export function updateChatName(chatId: string, name: string): Chat | undefined {
  const chat = chats.get(chatId);
  if (!chat) return undefined;
  chat.name = name;
  return chat;
}
