import { DefiPositionItem } from './deFi';
import { NftItem } from './nfts';
import { Portfolio } from './portfolio';
import { TokenItem } from './tokens';
import { TransactionItem } from './transactions';

export interface ContextPortfolioData {
  address: string;
  portfolio: Portfolio['attributes'] | undefined;
  recentTransactions?: TransactionItem[];
  tokens: TokenItem[];
  nfts?: NftItem[];
  defiPositions?: DefiPositionItem[];
}
