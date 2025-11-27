import { useTokenData } from '@web3-ai-copilot/data-hooks';
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Skeleton,
} from '@web3-ai-copilot/ui-components';
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from '@web3-ai-copilot/shared-utils';
import { SparklineChart } from '@web3-ai-copilot/trading-charts';
import { LineData, Time } from 'lightweight-charts';
import { CardContainer } from '@e-burgos/tucu-ui';

interface TokenListProps {
  tokens?: Array<{
    id: string;
    symbol: string;
    name: string;
    value: number;
    price: number;
    priceChange24h: number;
    balance: string;
    logo?: string;
  }>;
}

export function TokenList({ tokens: externalTokens }: TokenListProps) {
  const { data: tokens, isLoading } = useTokenData();

  const displayTokens = externalTokens || tokens || [];

  if (isLoading && !externalTokens) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-16" />
        ))}
      </div>
    );
  }

  if (displayTokens.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">No tokens found</p>
    );
  }

  // Generate mock sparkline data for demonstration
  const generateSparklineData = (): Array<{ time: number; value: number }> => {
    const data: Array<{ time: number; value: number }> = [];
    const baseValue = 100;
    for (let i = 0; i < 20; i++) {
      data.push({
        time: Date.now() - (20 - i) * 3600000,
        value: baseValue + Math.random() * 20 - 10,
      });
    }
    return data;
  };

  return (
    <CardContainer className="flex flex-col w-full space-y-2 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24h Change</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Chart</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {displayTokens.map((token) => (
            <TableRow key={token.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {token.logo && (
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {token.name}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell align="right">
                {formatNumber(parseFloat(token.balance || '0'), 4)}
              </TableCell>
              <TableCell align="right">{formatCurrency(token.price)}</TableCell>
              <TableCell align="right">
                <span
                  className={
                    token.priceChange24h >= 0
                      ? 'text-green-500'
                      : 'text-red-500'
                  }
                >
                  {formatPercentage(token.priceChange24h)}
                </span>
              </TableCell>
              <TableCell align="right">{formatCurrency(token.value)}</TableCell>
              <TableCell>
                <div className="w-24 h-10">
                  <SparklineChart
                    data={
                      generateSparklineData() as unknown as LineData<Time>[]
                    }
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </CardContainer>
  );
}
