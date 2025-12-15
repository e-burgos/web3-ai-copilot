import { useContextPortfolioData } from '@web3-ai-copilot/data-hooks';
import { formatAddress } from '@web3-ai-copilot/shared-utils';
import { useAccount } from 'wagmi';
import { Button } from '@e-burgos/tucu-ui';
import { exportToCsv, exportToPdf } from '../services';

export function ExportButton() {
  const { data: contextPortfolioData } = useContextPortfolioData();
  const { address } = useAccount();

  const handleExportCsv = () => {
    if (!contextPortfolioData || !address) {
      return;
    }

    exportToCsv(
      contextPortfolioData,
      `portfolio-${formatAddress(address, 6, 4)}`
    );
  };

  const handleExportPdf = async () => {
    if (!contextPortfolioData || !address) {
      return;
    }

    await exportToPdf(
      contextPortfolioData,
      `portfolio-${formatAddress(address, 6, 4)}`
    );
  };

  if (!contextPortfolioData || !address) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <Button size="small" onClick={handleExportCsv}>
        Export CSV
      </Button>
      <Button size="small" onClick={handleExportPdf}>
        Export PDF
      </Button>
    </div>
  );
}
