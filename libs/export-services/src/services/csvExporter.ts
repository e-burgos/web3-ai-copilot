import type { ContextPortfolioData } from '@web3-ai-copilot/data-hooks';

export function exportToCsv(
  data: ContextPortfolioData,
  filename = 'portfolio'
): void {
  const sections: string[] = [];

  // Header
  sections.push('Portfolio Export');
  sections.push(`Address: ${data.address}`);
  sections.push(`Date: ${new Date().toLocaleDateString()}`);
  sections.push('');

  // Summary
  sections.push('=== SUMMARY ===');
  sections.push(
    `Total Portfolio Value,${data.portfolio?.total?.positions?.toFixed(2) || '0.00'} USD`
  );
  sections.push('');

  // Tokens Section
  sections.push('=== TOKENS ===');
  const tokenHeaders = [
    'Symbol',
    'Name',
    'Balance',
    'Price (USD)',
    'Value (USD)',
  ];
  sections.push(tokenHeaders.join(','));
  data.tokens.forEach((token) => {
    sections.push(
      [
        token.symbol,
        `"${token.name}"`,
        token.balance,
        token.price.toString(),
        token.value.toString(),
      ].join(',')
    );
  });
  sections.push('');

  // NFTs Section
  if (data.nfts && data.nfts.length > 0) {
    sections.push('=== NFTs ===');
    const nftHeaders = [
      'Name',
      'Collection',
      'Value (USD)',
      'Price (USD)',
      'Contract Address',
      'Token ID',
    ];
    sections.push(nftHeaders.join(','));
    data.nfts.forEach((nft) => {
      sections.push(
        [
          `"${nft.name || 'Unnamed'}"`,
          `"${nft.collection || 'Unknown'}"`,
          nft.value?.toString() || '-',
          nft.price?.toString() || '-',
          nft.contractAddress || '-',
          nft.tokenId || '-',
        ].join(',')
      );
    });
    sections.push('');
  }

  // DeFi Positions Section
  if (data.defiPositions && data.defiPositions.length > 0) {
    sections.push('=== DEFI POSITIONS ===');
    const defiHeaders = [
      'Name',
      'Protocol',
      'Type',
      'Token Symbol',
      'Value (USD)',
      'Price (USD)',
      'APY (%)',
    ];
    sections.push(defiHeaders.join(','));
    data.defiPositions.forEach((position) => {
      sections.push(
        [
          `"${position.name}"`,
          position.protocol,
          position.type,
          position.tokenSymbol,
          position.value.toString(),
          position.price.toString(),
          position.apy?.toString() || '-',
        ].join(',')
      );
    });
    sections.push('');
  }

  // Recent Transactions Section
  if (data.recentTransactions && data.recentTransactions.length > 0) {
    sections.push('=== RECENT TRANSACTIONS ===');
    const txHeaders = [
      'Hash',
      'Operation Type',
      'Date',
      'From',
      'To',
      'Fee (USD)',
    ];
    sections.push(txHeaders.join(','));
    data.recentTransactions.forEach((tx) => {
      const date = new Date(tx.mined_at * 1000).toLocaleString();
      sections.push(
        [
          tx.hash,
          tx.operation_type,
          `"${date}"`,
          tx.sent_from,
          tx.sent_to,
          tx.fee.toString(),
        ].join(',')
      );
    });
    sections.push('');
  }

  const csvContent = sections.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
