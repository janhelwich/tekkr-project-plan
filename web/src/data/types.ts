export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  messages: Message[];
}

export interface ChatReference {
  id: string;
  name: string;
}

export type LLMProvider = "anthropic" | "openai";

export const LLM_PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: "anthropic", label: "Claude (Anthropic)" },
  { value: "openai", label: "GPT-4o (OpenAI)" },
];
