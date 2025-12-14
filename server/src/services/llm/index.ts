import { LLMProvider } from "./provider";
import { AnthropicProvider } from "./anthropic";
import { OpenAIProvider } from "./openai";

export type LLMProviderType = "anthropic" | "openai";

export function createLLMProvider(type: LLMProviderType = "anthropic"): LLMProvider {
  switch (type) {
    case "anthropic":
      return new AnthropicProvider();
    case "openai":
      return new OpenAIProvider();
    default:
      return new AnthropicProvider();
  }
}

// Provider cache to reuse instances
const providerCache = new Map<LLMProviderType, LLMProvider>();

export function getProvider(type: LLMProviderType): LLMProvider {
  if (!providerCache.has(type)) {
    providerCache.set(type, createLLMProvider(type));
  }
  return providerCache.get(type)!;
}

// Default provider instance - uses Anthropic
export const llmProvider = createLLMProvider("anthropic");

export type { LLMProvider } from "./provider";
