import { AIConfig, AIProvider } from '../types/aiTypes';

export function getAIConfig(provider: AIProvider): AIConfig {
  const configs: Record<AIProvider, () => AIConfig> = {
    openai: () => ({
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      maxTokens: 2000,
    }),
    anthropic: () => ({
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY || '',
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 2000,
    }),
    llama: () => ({
      provider: 'llama',
      apiKey: process.env.LLAMA_API_KEY || '',
      model: 'llama-2-70b-chat',
      temperature: 0.7,
      maxTokens: 2000,
    }),
  };

  return configs[provider]();
}

