import { createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { supportedChains } from './chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';

export const wagmiConfig = createConfig({
  chains: supportedChains,
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [supportedChains[0].id]: http(),
    [supportedChains[1].id]: http(),
    [supportedChains[2].id]: http(),
    [supportedChains[3].id]: http(),
    [supportedChains[4].id]: http(),
  },
});

