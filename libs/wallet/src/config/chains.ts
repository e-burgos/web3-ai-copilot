import { mainnet, arbitrum, optimism, base, polygon } from 'wagmi/chains';

export const supportedChains = [mainnet, arbitrum, optimism, base, polygon] as const;

export type SupportedChain = (typeof supportedChains)[number];

export const chainNames: Record<number, string> = {
  [mainnet.id]: 'Ethereum',
  [arbitrum.id]: 'Arbitrum',
  [optimism.id]: 'Optimism',
  [base.id]: 'Base',
  [polygon.id]: 'Polygon',
};

export const nativeTokens: Record<number, string> = {
  [mainnet.id]: 'ETH',
  [arbitrum.id]: 'ETH',
  [optimism.id]: 'ETH',
  [base.id]: 'ETH',
  [polygon.id]: 'MATIC',
};

