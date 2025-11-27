import { Skeleton } from '@web3-ai-copilot/ui-components';
import { formatNumber } from '@web3-ai-copilot/shared-utils';
import { usePortfolio } from '@web3-ai-copilot/data-hooks';
import { CardContainer, Typography } from '@e-burgos/tucu-ui';

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
      <div className="space-y-6">
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
        <Skeleton variant="rectangular" className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!portfolio) {
    return null;
  }

  return (
    <div className="space-y-6">
      <CardContainer className="flex flex-col w-full space-y-2 p-4 rounded-lg shadow-lg">
        <Typography tag="h3" className="text-xl font-semibold mb-4">
          Distribution by Chain
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positionsByChainToArray.map(([chainId, balance]) => (
            <div key={chainId} className="space-y-1">
              <Typography tag="h4" className="text-sm text-muted-foreground">
                {chainId
                  .toLowerCase()
                  .replace('-', ' ')
                  .replace('_', ' ')
                  .toUpperCase()}
              </Typography>
              <Typography tag="h4" className="text-lg font-semibold text-brand">
                {`$ ${formatNumber(parseFloat(balance.toString()), 4)}`}
              </Typography>
            </div>
          ))}
        </div>
      </CardContainer>

      <CardContainer className="flex flex-col w-full space-y-2 p-4 rounded-lg shadow-lg">
        <Typography tag="h3" className="text-xl font-semibold mb-4">
          Distribution by Type
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {positionsByTypeToArray.map(([type, balance]) => (
            <div key={type} className="space-y-1">
              <Typography tag="h4" className="text-sm text-muted-foreground">
                {type
                  .toLowerCase()
                  .replace('-', ' ')
                  .replace('_', ' ')
                  .toUpperCase()}
              </Typography>
              <Typography tag="h4" className="text-lg font-semibold text-brand">
                {`$ ${formatNumber(parseFloat(balance.toString()), 4)}`}
              </Typography>
            </div>
          ))}
        </div>
      </CardContainer>
    </div>
  );
}
