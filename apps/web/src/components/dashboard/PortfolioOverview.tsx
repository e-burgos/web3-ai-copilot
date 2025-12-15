import { CardContainer, Typography } from '@e-burgos/tucu-ui';
import { formatCurrency } from '@web3-ai-copilot/shared-utils';

interface PortfolioOverviewProps {
  totalValue: number;
}

export function PortfolioOverview({ totalValue }: PortfolioOverviewProps) {
  return (
    <CardContainer className="border border-brand">
      <div className="space-y-2">
        <Typography tag="h3" className="font-semibold">
          Portfolio Overview
        </Typography>
        <Typography tag="h1" className="font-bold text-brand">
          {formatCurrency(totalValue)}
        </Typography>
      </div>
    </CardContainer>
  );
}
