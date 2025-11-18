import { useMultiChainBalance } from '@web3-ai-copilot/wallet';
import { Card, Skeleton } from '@web3-ai-copilot/ui-components';
import { formatNumber } from '@web3-ai-copilot/shared-utils';

export function NativeBalance() {
  const { data: balances, isLoading } = useMultiChainBalance();

  if (isLoading) {
    return (
      <Card>
        <Skeleton variant="rectangular" className="h-32" />
      </Card>
    );
  }

  if (!balances || balances.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Native Balances</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {balances.map((balance) => (
          <div key={balance.chainId} className="space-y-1">
            <div className="text-sm text-muted-foreground">{balance.chainName}</div>
            <div className="text-lg font-semibold">
              {formatNumber(parseFloat(balance.formatted), 4)} {balance.symbol}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

