interface PortfolioData {
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: number;
    price: number;
  }>;
  totalValue: number;
}

export function exportToCsv(data: PortfolioData, filename = 'portfolio'): void {
  const headers = ['Symbol', 'Name', 'Balance', 'Price (USD)', 'Value (USD)'];
  const rows = data.tokens.map((token) => [
    token.symbol,
    token.name,
    token.balance,
    token.price.toString(),
    token.value.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
    '',
    `Total Value,${data.totalValue}`,
  ].join('\n');

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

