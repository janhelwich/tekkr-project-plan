import { LLMProvider } from "./provider";
import { DummyLLMProvider } from "./dummy";

export type LLMProviderType = "dummy" | "anthropic" | "openai" | "gemini";

export function createLLMProvider(type: LLMProviderType = "dummy"): LLMProvider {
  switch (type) {
    case "dummy":
      return new DummyLLMProvider();
    case "anthropic":
      // TODO: Implement AnthropicProvider
      throw new Error("Anthropic provider not yet implemented");
    case "openai":
      // TODO: Implement OpenAIProvider
      throw new Error("OpenAI provider not yet implemented");
    case "gemini":
      // TODO: Implement GeminiProvider
      throw new Error("Gemini provider not yet implemented");
    default:
      return new DummyLLMProvider();
  }
}

// Default provider instance
export const llmProvider = createLLMProvider("dummy");

export { LLMProvider } from "./provider";
