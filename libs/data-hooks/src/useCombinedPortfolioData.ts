import { useAccount } from 'wagmi';
import { usePortfolio } from './usePortfolio';
import { useTokenData } from './useTokenData';
import { useNftData } from './useNftData';
import { useDefiPositions } from './useDefiPositions';
import { useTransactionData } from './useTransactionData';

export interface CombinedPortfolioData {
  address: string;
  totalValue: number;
  tokens: Array<{
    symbol: string;
    name: string;
    balance: string;
    value: number;
    price: number;
    priceChange24h: number;
    logo?: string;
  }>;
  nfts?: Array<{
    id: string;
    name?: string;
    description?: string;
    collection?: {
      name?: string;
    };
    value?: number;
    floorPrice?: number;
  }>;
  defiPositions?: Array<{
    id: string;
    type: string;
    name?: string;
    protocol?: string;
    value?: number;
    apy?: number;
  }>;
  recentTransactions?: Array<{
    id: string;
    operation_type: string;
    hash: string;
    mined_at: string;
    transfers: Array<{
      direction: string;
      fungible_info?: {
        name?: string;
        symbol?: string;
      };
      quantity: {
        numeric: string;
      };
      value?: number;
    }>;
    fee?: {
      value?: number;
    };
  }>;
}

export function useCombinedPortfolioData() {
  const { address } = useAccount();

  const { data: portfolioData, isLoading: portfolioLoading } = usePortfolio();
  const { data: tokenData, isLoading: tokenLoading } = useTokenData();
  const { data: nftData, isLoading: nftLoading } = useNftData();
  const { data: defiData, isLoading: defiLoading } = useDefiPositions();
  const { data: transactionData, isLoading: transactionLoading } =
    useTransactionData();

  // console.log('portfolioData', portfolioData);
  // console.log('tokenData', tokenData);
  // console.log('nftData', nftData);
  // console.log('defiData', defiData);
  // console.log('transactionData', transactionData);

  const isLoading =
    portfolioLoading ||
    tokenLoading ||
    nftLoading ||
    defiLoading ||
    transactionLoading;

  const combinedData: CombinedPortfolioData | null =
    address && !isLoading
      ? {
          address,
          totalValue: portfolioData?.totalValue || 0,
          tokens:
            tokenData?.map((token) => ({
              symbol: token.symbol,
              name: token.name,
              balance: token.balance,
              value: token.value,
              price: token.price,
              priceChange24h: token.priceChange24h,
              logo: token.logo,
            })) || [],
          // nfts: nftData?.data?.map(nft => ({
          //   id: nft.id,
          //   name: nft.attributes?.name,
          //   description: nft.attributes?.description,
          //   collection: nft.attributes?.collection,
          //   value: nft.value,
          //   floorPrice: nft.price,
          // })) || [],
          // defiPositions: defiData?.data?.map(position => ({
          //   id: position.id,
          //   type: position.type,
          //   name: position.attributes?.fungible_info?.name || position.attributes?.name,
          //   protocol: position.attributes?.protocol?.name,
          //   value: position.value,
          //   apy: position.attributes?.apy,
          // })) || [],
          recentTransactions:
            transactionData?.data?.slice(0, 10).map((tx) => ({
              // Solo las últimas 10 transacciones
              id: tx.id,
              operation_type: tx.attributes.operation_type,
              hash: tx.attributes.hash,
              mined_at: tx.attributes.mined_at,
              transfers: tx.attributes.transfers.map((transfer) => ({
                direction: transfer.direction,
                fungible_info: transfer.fungible_info,
                quantity: {
                  numeric: transfer.quantity.numeric,
                },
                value: transfer.value,
              })),
              fee: tx.attributes.fee
                ? {
                    value: tx.attributes.fee.value,
                  }
                : undefined,
            })) || [],
        }
      : null;

  return {
    data: combinedData,
    isLoading,
    isError: !address || (!portfolioData && !isLoading),
  };
}
