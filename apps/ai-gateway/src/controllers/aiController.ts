import { llmService } from '../services/llmService';
import { getPortfolioAnalysisPrompt } from '@web3-ai-copilot/ai-config';
import { AIProvider } from '@web3-ai-copilot/ai-config';
import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks/types-only';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

function getDefaultProvider(): AIProvider {
  // If GROQ_API_KEY is available, prefer Groq (OpenAI-compatible, faster)
  if (process.env.GROQ_API_KEY) {
    return 'groq';
  }
  // Otherwise use the configured default or fallback to openai
  return (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
}

export const aiController = {
  async chat(
    messages: ChatMessage[],
    provider?: AIProvider,
    portfolioData?: ContextPortfolioData,
    model?: string
  ) {
    const defaultProvider = getDefaultProvider();
    const selectedProvider = provider || defaultProvider;

    let systemPrompt = 'You are a helpful Web3 AI assistant.';

    if (portfolioData) {
      systemPrompt = `You are a helpful Web3 AI assistant with access to the user's portfolio data.

Portfolio Overview:
- Wallet Address: ${portfolioData.address}
- Total Portfolio Value: $${portfolioData.portfolio?.total?.positions || 0}

Tokens (${portfolioData.tokens?.length}):
${portfolioData.tokens
  ?.slice(0, 10)
  .map(
    (token) =>
      `- ${token.name} (${token.symbol}): ${token.balance} ($${token.value.toLocaleString()}) - ${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%`
  )
  .join('\n')}

${
  portfolioData.nfts && portfolioData.nfts.length > 0
    ? `NFTs (${portfolioData.nfts?.length}):
${portfolioData.nfts
  ?.slice(0, 5)
  .map(
    (nft) =>
      `- ${nft.name || 'Unnamed NFT'} ${nft.collection || 'Unknown Collection'} ${nft.value ? `- $${nft.value.toLocaleString()}` : ''}`
  )
  .join('\n')}`
    : ''
}

${
  portfolioData.defiPositions && portfolioData.defiPositions?.length > 0
    ? `DeFi Positions (${portfolioData.defiPositions?.length}):
${portfolioData.defiPositions
  ?.slice(0, 5)
  .map(
    (position) =>
      `- ${position.name || position.type} ${position.protocol ? `(${position.protocol})` : ''} ${position.value ? `- $${position.value.toLocaleString()}` : ''} ${position.apy ? `- ${position.apy}% APY` : ''}`
  )
  .join('\n')}`
    : ''
}

${
  portfolioData.recentTransactions &&
  portfolioData.recentTransactions.length > 0
    ? `Recent Transactions (${portfolioData.recentTransactions?.length}):
${portfolioData.recentTransactions
  ?.slice(0, 5)
  .map(
    (tx) =>
      `- ${tx.operation_type} on ${new Date(tx.mined_at).toLocaleDateString()} - ${tx.transfers?.length} transfers`
  )
  .join('\n')}`
    : ''
}

Use this portfolio context to provide relevant, personalized responses about the user's Web3 assets, performance, and recommendations. If asked about portfolio analysis, leverage this data to give specific insights.`;
    }

    const enhancedMessages: ChatMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ];

    const response = await llmService.chat(
      enhancedMessages,
      selectedProvider,
      model
    );
    return response;
  },

  async analyzePortfolio(
    portfolioData: ContextPortfolioData,
    provider?: AIProvider
  ) {
    const defaultProvider = getDefaultProvider();
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
