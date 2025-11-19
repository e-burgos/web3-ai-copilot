import { Card, Skeleton } from '@web3-ai-copilot/ui-components';
import { formatNumber } from '@web3-ai-copilot/shared-utils';
import { usePortfolio } from '@web3-ai-copilot/data-hooks';

export function NativeBalance() {
  const { data: portfolio, isLoading } = usePortfolio();

  const positionsByChainToArray = Object.entries(
    portfolio?.portfolio.attributes.positions_distribution_by_chain || {}
  );

  const positionsByTypeToArray = Object.entries(
    portfolio?.portfolio.attributes.positions_distribution_by_type || {}
  );

  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" className="h-32" />
      </Card>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Distribution by Chain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positionsByChainToArray.map(([chainId, balance]) => (
            <div key={chainId} className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {chainId.toLowerCase().replace('-', ' ').replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-lg font-semibold">
                {`$ ${formatNumber(parseFloat(balance.toString()), 4)}`}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Distribution by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positionsByTypeToArray.map(([type, balance]) => (
            <div key={type} className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {type.toLowerCase().replace('-', ' ').replace('_', ' ').toUpperCase()}
              </div>
              <div className="text-lg font-semibold">
                {`$ ${formatNumber(parseFloat(balance.toString()), 4)}`}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
