import { Message } from "../../domain/chat";

export interface LLMProvider {
  generateResponse(messages: Message[]): Promise<string>;
  readonly name: string;
}
