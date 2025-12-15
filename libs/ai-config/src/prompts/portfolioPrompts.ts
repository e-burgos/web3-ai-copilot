import type {
  ContextPortfolioData,
  DefiPositionItem,
  NftItem,
  TokenItem,
  TransactionItem,
} from '@web3-ai-copilot/data-hooks/types-only';

export function getPortfolioAnalysisPrompt(
  portfolioData: ContextPortfolioData
): string {
  return `You are a crypto portfolio analyst. Analyze the following portfolio:

Total Value: $${portfolioData.portfolio?.total?.positions || 0}

Tokens:
${portfolioData.tokens
  .map(
    (token) =>
      `- ${token.symbol} (${token.name}): $${token.value.toFixed(2)} (24h: ${token.priceChange24h >= 0 ? '+' : ''}${token.priceChange24h.toFixed(2)}%)`
  )
  .join('\n')}
NFTs:
${
  portfolioData.nfts
    ?.map(
      (nft) =>
        `- ${nft.name} (${nft.collection}): $${nft.value?.toFixed(2) || 0}`
    )
    .join('\n') || 'No NFTs'
}
DeFi Positions:
${
  portfolioData.defiPositions
    ?.map(
      (position) =>
        `- ${position.name} (${position.protocol}): $${position.value?.toFixed(2) || 0}`
    )
    .join('\n') || 'No DeFi Positions'
}
Recent Transactions:
${
  portfolioData.recentTransactions
    ?.map(
      (transaction) =>
        `- ${transaction.hash}: ${transaction.operation_type} on ${new Date(transaction.mined_at).toLocaleDateString()} - ${transaction.transfers?.length} transfers`
    )
    .join('\n') || 'No Recent Transactions'
}

Provide:
1. Portfolio composition analysis
2. Risk assessment
3. Diversification insights
4. Optimization suggestions
5. Market outlook for top holdings
6. Recent transactions analysis
7. NFTs analysis: Provide a brief explanation of each NFT in the portfolio
8. DeFi positions analysis: Provide a brief explanation of each DeFi position in the portfolio
9. Token analysis: Provide a brief explanation of each token in the portfolio
10. Recent transactions analysis: Provide a brief explanation of each recent transaction in the portfolio

Be concise and actionable.`;
}

export function getTokenExplanationPrompt(
  tokenSymbol: string,
  tokenData: TokenItem
): string {
  return `Explain the token ${tokenSymbol} (${tokenData.name}):

Current Price: $${tokenData.price.toFixed(2)}
Current Balance: ${tokenData.balance}
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

export function getNftExplanationPrompt(
  nftName: string,
  nftData: NftItem
): string {
  return `Explain the NFT ${nftName} (${nftData.collection}):

    Current Price: $${nftData.price?.toFixed(2) || 0}
    Current Balance: ${nftData.collection || 'Unknown Collection'}
    Portfolio Value: $${nftData.value?.toFixed(2) || 0}
    Description: ${nftData.description || 'No Description'}
    Image: ${nftData.image || 'No Image'}
    Preview Image: ${nftData.previewImage || 'No Preview Image'}
    Contract Address: ${nftData.contractAddress || 'No Contract Address'}
    Token ID: ${nftData.tokenId || 'No Token ID'}
    Interface: ${nftData.interface || 'No Interface'}

    Provide:
    1. What is this NFT?
    2. What is the value of the NFT?
    3. What is the balance of the NFT?
    4. What is the price of the NFT?
    5. What is the price change 24h of the NFT?
    6. What is the contract address of the NFT?
    7. What is the token ID of the NFT?
    8. What is the interface of the NFT?

    Be informative and concise.`;
}

export function getDefiPositionExplanationPrompt(
  defiPositionName: string,
  defiPositionData: DefiPositionItem
): string {
  return `Explain the DeFi position ${defiPositionName} (${defiPositionData.protocol}):

    Current Value: $${defiPositionData.value?.toFixed(2) || 0}
    Current Balance: ${defiPositionData.tokenName} (${defiPositionData.tokenSymbol})
    Current APY: ${defiPositionData.apy?.toFixed(2) || 0}%
    Current Price: $${defiPositionData.price?.toFixed(2) || 0}
    Current Price Change 24h: ${defiPositionData.priceChange24h?.toFixed(2) || 0}%
    Current Pool Address: ${defiPositionData.poolAddress || 'No Pool Address'}
    Current Chain: ${defiPositionData.chainId || 'No Chain'}
    Current Type: ${defiPositionData.type || 'No Type'}
    Current Protocol: ${defiPositionData.protocol || 'No Protocol'}
    Current Token Name: ${defiPositionData.tokenName || 'No Token Name'}
    Current Token Symbol: ${defiPositionData.tokenSymbol || 'No Token Symbol'}

    Provide:
    1. What is this DeFi position?
    2. What is the value of the DeFi position?
    3. What is the balance of the DeFi position?
    4. What is the APY of the DeFi position?
    5. What is the price of the DeFi position?
    6. What is the price change 24h of the DeFi position?
    7. What is the pool address of the DeFi position?
    8. What is the chain of the DeFi position?
    9. What is the type of the DeFi position?
    10. What is the protocol of the DeFi position?
    11. What is the token name of the DeFi position?
    12. What is the token symbol of the DeFi position?

    Be informative and concise.`;
}

export function getRecentTransactionExplanationPrompt(
  transactionHash: string,
  transactionData: TransactionItem
): string {
  return `Explain the recent transaction ${transactionHash}:

    Current Value: $${transactionData.transfers?.reduce((sum, transfer) => sum + (transfer.value || 0), 0) || 0}
    Current Balance: ${transactionData.transfers?.map((transfer) => `- ${transfer.fungible_info?.name} (${transfer.fungible_info?.symbol}): ${transfer.quantity}`).join('\n')}
    Current Fee: $${transactionData.fee?.toFixed(2) || 0}
    Current Operation Type: ${transactionData.operation_type}
    Current Mined At: ${new Date(transactionData.mined_at).toLocaleDateString()}
    Current Sent From: ${transactionData.sent_from}
    Current Sent To: ${transactionData.sent_to}
    Current Transfers: ${transactionData.transfers?.map((transfer) => `- ${transfer.fungible_info?.name} (${transfer.fungible_info?.symbol}): ${transfer.quantity}`).join('\n')}
    
    Provide:
    1. What is this recent transaction?
    2. What is the value of the transaction?
    3. What are the transfers?
    4. What is the fee?
    5. What is the operation type?
    6. What is the mined at?
    7. What is the sent from?
    8. What is the sent to?

    Be informative and concise.`;
}
