import { usePortfolio } from '@web3-ai-copilot/data-hooks';
import { Skeleton } from '@web3-ai-copilot/ui-components';
import { formatCurrency } from '@web3-ai-copilot/shared-utils';
import { NativeBalance } from './NativeBalance';
import { CardContainer, LucideIcons, Typography } from '@e-burgos/tucu-ui';

export function PortfolioDashboard() {
  const { data, isLoading, error } = usePortfolio();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="rectangular" className="h-24 rounded-lg" />
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.DatabaseBackup className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-destructive">
            Error loading portfolio: {error.message}
          </Typography>
        </div>
      </CardContainer>
    );
  }

  if (!data) {
    return (
      <CardContainer>
        <div className="flex w-full flex-col items-center justify-center text-center gap-2 py-4">
          <LucideIcons.DatabaseBackup className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No portfolio data available
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <CardContainer>
        <div className="space-y-2">
          <Typography tag="h3" className="font-semibold">
            Portfolio Overview
          </Typography>
          <Typography tag="h1" className="font-bold text-brand">
            {formatCurrency(data.totalValue)}
          </Typography>
        </div>
      </CardContainer>
      <NativeBalance />
    </div>
  );
}
