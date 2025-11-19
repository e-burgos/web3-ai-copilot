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
  async chat(messages: AIMessage[], provider: AIProvider): Promise<ChatResponse> {
    switch (provider) {
      case 'openai':
        return this.chatWithOpenAI(messages);
      case 'anthropic':
        return this.chatWithAnthropic(messages);
      case 'llama':
        return this.chatWithLlama(messages);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private async chatWithOpenAI(messages: AIMessage[]): Promise<ChatResponse> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
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

  private async chatWithAnthropic(messages: AIMessage[]): Promise<ChatResponse> {
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
}

export const llmService = new LLMService();
