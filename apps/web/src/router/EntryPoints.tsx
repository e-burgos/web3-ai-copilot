import { lazy } from 'react';

const HomePage = lazy(() => import('../pages/HomePage'));
const TokensPage = lazy(() => import('../pages/TokensPage'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));

export const HomePageComponent = ({ ...props }) => {
  return <HomePage {...props} />;
};

export const TokensPageComponent = ({ ...props }) => {
  return <TokensPage {...props} />;
};

export const TransactionsPageComponent = ({ ...props }) => {
  return <TransactionsPage {...props} />;
};
