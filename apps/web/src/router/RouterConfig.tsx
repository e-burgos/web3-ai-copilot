import {
  HomePageComponent,
  TokensPageComponent,
  TransactionsPageComponent,
  NFTsPageComponent,
  DefiPositionsPageComponent,
} from './EntryPoints';
import { AppRoutesMenuItem, LucideIcons } from '@e-burgos/tucu-ui';

export const useRouterConfig = (): AppRoutesMenuItem[] => [
  {
    name: 'Dashboard',
    href: '/',
    icon: <LucideIcons.PieChart />,
    component: <HomePageComponent />,
  },
  {
    name: 'Tokens',
    href: '/tokens',
    icon: <LucideIcons.Coins />,
    component: <TokensPageComponent />,
  },
  {
    name: 'NFTs',
    href: '/nfts',
    icon: <LucideIcons.Image />,
    component: <NFTsPageComponent />,
  },
  {
    name: 'DeFi Positions',
    href: '/defi',
    icon: <LucideIcons.TrendingUp />,
    component: <DefiPositionsPageComponent />,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: <LucideIcons.SendToBack />,
    component: <TransactionsPageComponent />,
  },
];
