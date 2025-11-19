import { useCombinedPortfolioData } from '@web3-ai-copilot/data-hooks';
import { useAccount } from 'wagmi';
import { Button } from '@web3-ai-copilot/ui-components';
import { exportToCsv, exportToPdf } from '@web3-ai-copilot/export-services';

export function ExportButton() {
  const { data: combinedPortfolioData } = useCombinedPortfolioData();
  const { address } = useAccount();

  const handleExportCsv = () => {
    if (!combinedPortfolioData || !address) {
      return;
    }

    const tokens = combinedPortfolioData.tokens;

    exportToCsv(
      {
        tokens,
        totalValue: combinedPortfolioData.totalValue,
      },
      `portfolio-${address.slice(0, 8)}`
    );
  };

  const handleExportPdf = async () => {
    if (!combinedPortfolioData || !address) {
      return;
    }

    const tokens = combinedPortfolioData.tokens;

    await exportToPdf(
      {
        tokens,
        totalValue: combinedPortfolioData.totalValue,
        address,
        date: new Date().toLocaleDateString(),
      },
      `portfolio-${address.slice(0, 8)}`
    );
  };

  if (!combinedPortfolioData || !address) {
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
