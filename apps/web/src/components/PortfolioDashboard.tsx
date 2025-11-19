import { usePortfolio } from '@web3-ai-copilot/data-hooks';
import { Card, Skeleton } from '@web3-ai-copilot/ui-components';
import { formatCurrency } from '@web3-ai-copilot/shared-utils';
import { TokenList } from './TokenList';
import { NativeBalance } from './NativeBalance';
import { Transactions } from './Transactions';

export function PortfolioDashboard() {
  const { data, isLoading, error } = usePortfolio();

  console.log(data);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <Skeleton variant="rectangular" className="h-24" />
        </Card>
        <Card>
          <Skeleton variant="rectangular" className="h-64" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-destructive">Error loading portfolio: {error.message}</p>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No portfolio data available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Portfolio Overview</h2>
          <div className="text-4xl font-bold">{formatCurrency(data.totalValue)}</div>
        </div>
      </Card>

      <NativeBalance />

      <Card>
        <h3 className="text-xl font-semibold mb-4">Tokens</h3>
        <TokenList />
      </Card>

      {/* <Transactions /> */}
    </div>
  );
}
