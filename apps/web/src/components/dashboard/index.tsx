import { usePortfolioData, useTokenData } from '@web3-ai-copilot/data-hooks';
import {
  CardContainer,
  LucideIcons,
  Typography,
  Alert,
} from '@e-burgos/tucu-ui';
import { PortfolioOverview } from './PortfolioOverview';
import { AssetAllocationChart } from './AssetAllocationChart';
import { TopAssetsChart } from './TopAssetsChart';
import { DistributionByChain } from './DistributionByChain';
import { DistributionByType } from './DistributionByType';
import { Skeleton } from '../common/Skeleton';
import { useMemo } from 'react';

export function Dashboard() {
  const {
    data,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = usePortfolioData();
  const {
    data: tokensData,
    isLoading: isTokensLoading,
    error: tokensError,
  } = useTokenData({ trash: 'only_non_trash' });

  const portfolioData = useMemo(() => data?.data, [data]);
  const tokens = useMemo(() => tokensData?.data, [tokensData]);

  const isLoading = portfolioLoading || isTokensLoading;
  const error = portfolioError || tokensError;

  // Process data for charts
  const sortedTokens = tokens
    ? [...tokens].sort((a, b) => b.value - a.value)
    : [];
  const topTokens = sortedTokens?.slice(0, 5);
  const otherValue = sortedTokens
    ?.slice(5)
    .reduce((acc, t) => acc + t.value, 0);

  const pieData = [
    ...(topTokens || []).map((t) => ({ name: t.symbol, value: t.value })),
    ...(otherValue > 0 ? [{ name: 'Others', value: otherValue }] : []),
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert variant="info">
          This is a demo version. The server may be in hibernation to reduce
          costs, so please be patient until it is back online.
        </Alert>
        <Skeleton variant="rectangular" className="h-24 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton variant="rectangular" className="h-64 rounded-lg" />
          <Skeleton variant="rectangular" className="h-64 rounded-lg" />
        </div>
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
          <LucideIcons.Wallet className="w-16 h-16 text-muted-foreground mb-2" />
          <Typography tag="h4" className="text-muted-foreground">
            No portfolio data available
          </Typography>
        </div>
      </CardContainer>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <PortfolioOverview totalValue={portfolioData?.total?.positions || 0} />

      {tokens && tokens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AssetAllocationChart data={pieData} />
          <TopAssetsChart data={topTokens} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DistributionByChain
          portfolio={portfolioData?.positions_distribution_by_chain}
        />
        <DistributionByType
          portfolio={portfolioData?.positions_distribution_by_type}
        />
      </div>
    </div>
  );
}
