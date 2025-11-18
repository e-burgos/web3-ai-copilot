import { usePortfolio } from '@web3-ai-copilot/data-hooks';
import { useAccount } from 'wagmi';
import { Button } from '@web3-ai-copilot/ui-components';
import { exportToCsv, exportToPdf } from '@web3-ai-copilot/export-services';

interface PortfolioPosition {
  type: string;
  attributes?: {
    fungible_info?: {
      symbol?: string;
      name?: string;
    };
  };
  quantity?: string;
  value?: number;
  price?: number;
}

export function ExportButton() {
  const { data: portfolio } = usePortfolio();
  const { address } = useAccount();

  const handleExportCsv = () => {
    if (!portfolio || !address) {
      return;
    }

    const tokens = portfolio.positions
      .filter((pos: PortfolioPosition) => pos.type === 'fungible')
      .map((pos: PortfolioPosition) => ({
        symbol: pos.attributes?.fungible_info?.symbol || 'UNKNOWN',
        name: pos.attributes?.fungible_info?.name || 'Unknown Token',
        balance: pos.quantity || '0',
        value: pos.value || 0,
        price: pos.price || 0,
      }));

    exportToCsv(
      {
        tokens,
        totalValue: portfolio.totalValue,
      },
      `portfolio-${address.slice(0, 8)}`
    );
  };

  const handleExportPdf = async () => {
    if (!portfolio || !address) {
      return;
    }

    const tokens = portfolio.positions
      .filter((pos: PortfolioPosition) => pos.type === 'fungible')
      .map((pos: PortfolioPosition) => ({
        symbol: pos.attributes?.fungible_info?.symbol || 'UNKNOWN',
        name: pos.attributes?.fungible_info?.name || 'Unknown Token',
        balance: pos.quantity || '0',
        value: pos.value || 0,
        price: pos.price || 0,
      }));

    await exportToPdf(
      {
        tokens,
        totalValue: portfolio.totalValue,
        address,
        date: new Date().toLocaleDateString(),
      },
      `portfolio-${address.slice(0, 8)}`
    );
  };

  if (!portfolio || !address) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="sm" onClick={handleExportCsv}>
        Export CSV
      </Button>
      <Button variant="secondary" size="sm" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </div>
  );
}
