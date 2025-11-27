import {
  HomePageComponent,
  TokensPageComponent,
  TransactionsPageComponent,
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
    name: 'Transactions',
    href: '/transactions',
    icon: <LucideIcons.SendToBack />,
    component: <TransactionsPageComponent />,
  },
];
