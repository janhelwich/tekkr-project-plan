import { LLMProvider } from "./provider";
import { DummyLLMProvider } from "./dummy";
import { AnthropicProvider } from "./anthropic";

export type LLMProviderType = "dummy" | "anthropic" | "openai" | "gemini";

export function createLLMProvider(type: LLMProviderType = "anthropic"): LLMProvider {
  switch (type) {
    case "dummy":
      return new DummyLLMProvider();
    case "anthropic":
      return new AnthropicProvider();
    case "openai":
      // TODO: Implement OpenAIProvider
      throw new Error("OpenAI provider not yet implemented");
    case "gemini":
      // TODO: Implement GeminiProvider
      throw new Error("Gemini provider not yet implemented");
    default:
      return new AnthropicProvider();
  }
}

// Default provider instance - uses Anthropic
export const llmProvider = createLLMProvider("anthropic");

export type { LLMProvider } from "./provider";
