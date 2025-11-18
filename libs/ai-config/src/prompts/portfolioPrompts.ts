export function getPortfolioAnalysisPrompt(portfolioData: {
  totalValue: number;
  tokens: Array<{
    symbol: string;
    name: string;
    value: number;
    priceChange24h: number;
  }>;
}): string {
  return `You are a crypto portfolio analyst. Analyze the following portfolio:

Total Value: $${portfolioData.totalValue.toFixed(2)}

Tokens:
${portfolioData.tokens
  .map(
    (token) =>
      `- ${token.symbol} (${token.name}): $${token.value.toFixed(2)} (24h: ${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%)`
  )
  .join('\n')}

Provide:
1. Portfolio composition analysis
2. Risk assessment
3. Diversification insights
4. Optimization suggestions
5. Market outlook for top holdings

Be concise and actionable.`;
}

export function getTokenExplanationPrompt(tokenSymbol: string, tokenData: {
  name: string;
  price: number;
  priceChange24h: number;
  value: number;
}): string {
  return `Explain the token ${tokenSymbol} (${tokenData.name}):

Current Price: $${tokenData.price.toFixed(2)}
24h Change: ${tokenData.priceChange24h >= 0 ? '+' : ''}${tokenData.priceChange24h.toFixed(2)}%
Portfolio Value: $${tokenData.value.toFixed(2)}

Provide:
1. What is this token?
2. Key use cases
3. Recent performance analysis
4. Risk factors
5. Outlook

Be informative and concise.`;
}

