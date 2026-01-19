import {
  HomePageComponent,
  TokensPageComponent,
  TransactionsPageComponent,
  NFTsPageComponent,
  DefiPositionsPageComponent,
} from './EntryPoints';
import { StandaloneAppRoutesMenuItem, LucideIcons } from '@e-burgos/tucu-ui';

export const ROUTES = {
  DASHBOARD: '/',
  TOKENS: '/tokens',
  NFTS: '/nfts',
  DEFI: '/defi',
  TRANSACTIONS: '/transactions',
}

export const useRouterConfig = (): StandaloneAppRoutesMenuItem[] => {
  const menuItems = [ 
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
      icon: <LucideIcons.PieChart />,
    component: <HomePageComponent />,
  },
  {
    name: 'Tokens',
    path: ROUTES.TOKENS,
    icon: <LucideIcons.Coins />,
    component: <TokensPageComponent />,
  },
  {
    name: 'NFTs',
    path: ROUTES.NFTS,
    icon: <LucideIcons.Image />,
    component: <NFTsPageComponent />,
  },
  {
    name: 'DeFi Positions',
    path: ROUTES.DEFI,
    icon: <LucideIcons.TrendingUp />,
    component: <DefiPositionsPageComponent />,
  },
  {
    name: 'Transactions',
    path: ROUTES.TRANSACTIONS,
    icon: <LucideIcons.SendToBack />,
    component: <TransactionsPageComponent />,
    },
  ];

  return menuItems;

};
