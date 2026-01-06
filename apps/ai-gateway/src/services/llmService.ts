import { AIProvider, AIMessage } from '@web3-ai-copilot/ai-config';

interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class LLMService {
  async chat(
    messages: AIMessage[],
    provider: AIProvider,
    model?: string
  ): Promise<ChatResponse> {
    switch (provider) {
      case 'openai':
        return this.chatWithOpenAI(messages, model);
      case 'anthropic':
        return this.chatWithAnthropic(messages);
      case 'llama':
        return this.chatWithLlama(messages);
      case 'groq':
        return this.chatWithGroq(messages, model);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async chatWithOpenAI(
    messages: AIMessage[],
    customModel?: string
  ): Promise<ChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    // Use custom model if provided, otherwise use env var, otherwise default
    // Available models (most economical): gpt-4o-mini, gpt-4o-mini-2024-07-18, gpt-3.5-turbo, gpt-3.5-turbo-0125, gpt-3.5-turbo-1106
    const model = customModel || process.env.OPENAI_MODEL || 'gpt-4o-mini';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    };
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage,
    };
  }

  private async chatWithAnthropic(
    messages: AIMessage[]
  ): Promise<ChatResponse> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Convert messages format for Anthropic
    const systemMessage = messages.find((m) => m.role === 'system');
    const userMessages = messages.filter((m) => m.role !== 'system');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        system: systemMessage?.content || '',
        messages: userMessages.map((msg) => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      content?: Array<{ text?: string }>;
      usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
    };
    return {
      content: data.content?.[0]?.text || '',
      usage: data.usage,
    };
  }

  private async chatWithLlama(messages: AIMessage[]): Promise<ChatResponse> {
    // Placeholder for Llama local implementation
    // This would typically connect to a local Llama server
    const llamaUrl = process.env.LLAMA_API_URL || 'http://localhost:11434';
    const apiKey = process.env.LLAMA_API_KEY;

    const response = await fetch(`${llamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        model: 'llama-2-70b-chat',
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Llama API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
    };
    return {
      content: data.message?.content || '',
    };
  }

  private async chatWithGroq(
    messages: AIMessage[],
    customModel?: string
  ): Promise<ChatResponse> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Groq is compatible with OpenAI API, use GROQ_BASE_URL if available, otherwise default
    const baseUrl =
      process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1';
    // Use custom model if provided, otherwise use env var, otherwise default
    // Default to llama-3.3-70b-versatile (replacement for deprecated llama-3.1-70b-versatile)
    // Production models: llama-3.1-8b-instant, openai/gpt-oss-120b, openai/gpt-oss-20b
    // Production systems: groq/compound, groq/compound-mini (with built-in tools)
    // Preview models: meta-llama/llama-4-maverick-17b-128e-instruct, meta-llama/llama-4-scout-17b-16e-instruct,
    //                 moonshotai/kimi-k2-instruct-0905, openai/gpt-oss-safeguard-20b, qwen/qwen3-32b
    const model =
      customModel || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.statusText} - ${errorText}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };

    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
    };
  }
}

export const llmService = new LLMService();
