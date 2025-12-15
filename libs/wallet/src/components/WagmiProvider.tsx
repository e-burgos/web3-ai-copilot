import React from 'react';
import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { wagmiConfig } from '../config/wagmi';

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiProviderBase config={wagmiConfig}>{children}</WagmiProviderBase>;
}

export default WagmiProvider;
