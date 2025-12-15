import { formatNumber } from '@web3-ai-copilot/shared-utils';
import { CardContainer, Typography } from '@e-burgos/tucu-ui';
import { Portfolio } from '@web3-ai-copilot/data-hooks';

export function DistributionByType({
  portfolio,
}: {
  portfolio:
    | Portfolio['attributes']['positions_distribution_by_type']
    | undefined;
}) {
  const positionsByTypeToArray = Object.entries(portfolio || {});

  return (
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
  );
}
