import { llmService } from '../services/llmService';
import { getPortfolioAnalysisPrompt } from '@web3-ai-copilot/ai-config';
import { AIProvider } from '@web3-ai-copilot/ai-config';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PortfolioData {
  totalValue: number;
  tokens: Array<{
    symbol: string;
    name: string;
    value: number;
    priceChange24h: number;
  }>;
}

export const aiController = {
  async chat(messages: ChatMessage[], provider?: AIProvider) {
    const defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
    const selectedProvider = provider || defaultProvider;

    const response = await llmService.chat(messages, selectedProvider);
    return response;
  },

  async analyzePortfolio(portfolioData: PortfolioData, provider?: AIProvider) {
    const defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
    const selectedProvider = provider || defaultProvider;

    const prompt = getPortfolioAnalysisPrompt(portfolioData);
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are a crypto portfolio analyst. Provide insightful, actionable analysis.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await llmService.chat(messages, selectedProvider);
    return response;
  },
};

