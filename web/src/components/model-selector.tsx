import { LLMProvider, LLM_PROVIDERS } from "../data/types";

interface ModelSelectorProps {
  value: LLMProvider;
  onChange: (value: LLMProvider) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="model-select" className="text-sm text-muted-foreground">
        Model:
      </label>
      <select
        id="model-select"
        value={value}
        onChange={(e) => onChange(e.target.value as LLMProvider)}
        disabled={disabled}
        className="px-3 py-1.5 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {LLM_PROVIDERS.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
    </div>
  );
}
