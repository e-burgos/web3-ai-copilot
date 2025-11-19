import { llmService } from '../services/llmService';
import { getPortfolioAnalysisPrompt } from '@web3-ai-copilot/ai-config';
import { AIProvider } from '@web3-ai-copilot/ai-config';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface PortfolioData {
  address: string;
  totalValue: number;
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: number;
    price: number;
    priceChange24h: number;
    logo?: string;
  }>;
  nfts: Array<{
    id: string;
    name?: string;
    description?: string;
    collection?: {
      name?: string;
    };
    value?: number;
    floorPrice?: number;
  }>;
  defiPositions: Array<{
    id: string;
    type: string;
    name?: string;
    protocol?: string;
    value?: number;
    apy?: number;
  }>;
  recentTransactions: Array<{
    id: string;
    operation_type: string;
    hash: string;
    mined_at: string;
    transfers: Array<{
      direction: string;
      fungible_info?: {
        name?: string;
        symbol?: string;
      };
      quantity: {
        numeric: string;
      };
      value?: number;
    }>;
    fee?: {
      value?: number;
    };
  }>;
}

export const aiController = {
  async chat(messages: ChatMessage[], provider?: AIProvider, portfolioData?: PortfolioData) {
    const defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
    const selectedProvider = provider || defaultProvider;

    let systemPrompt = 'You are a helpful Web3 AI assistant.';

    if (portfolioData) {
      systemPrompt = `You are a helpful Web3 AI assistant with access to the user's portfolio data.

Portfolio Overview:
- Wallet Address: ${portfolioData.address}
- Total Portfolio Value: $${portfolioData.totalValue.toLocaleString()}

Tokens (${portfolioData.tokens?.length}):
${portfolioData.tokens
  ?.slice(0, 10)
  .map(
    (token) =>
      `- ${token.name} (${token.symbol}): ${token.balance} ($${token.value.toLocaleString()}) - ${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%`
  )
  .join('\n')}

${
  portfolioData.nfts?.length > 0
    ? `NFTs (${portfolioData.nfts?.length}):
${portfolioData.nfts
  ?.slice(0, 5)
  .map(
    (nft) =>
      `- ${nft.name || 'Unnamed NFT'} ${nft.collection?.name ? `(${nft.collection.name})` : ''} ${nft.value ? `- $${nft.value.toLocaleString()}` : ''}`
  )
  .join('\n')}`
    : ''
}

${
  portfolioData.defiPositions?.length > 0
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
  portfolioData.recentTransactions?.length > 0
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

    const response = await llmService.chat(enhancedMessages, selectedProvider);
    return response;
  },

  async analyzePortfolio(portfolioData: PortfolioData, provider?: AIProvider) {
    const defaultProvider = (process.env.DEFAULT_AI_PROVIDER as AIProvider) || 'openai';
    const selectedProvider = provider || defaultProvider;

    const prompt = getPortfolioAnalysisPrompt(portfolioData);
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are a crypto portfolio analyst. Provide insightful, actionable analysis.',
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
