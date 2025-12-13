export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

export interface ChatReference {
  id: string;
  name: string;
}
