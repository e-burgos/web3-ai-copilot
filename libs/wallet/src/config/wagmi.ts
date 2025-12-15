import { type Config, createConfig, http } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { supportedChains } from './chains';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';

// Build connectors array - only include WalletConnect if projectId is provided
const baseConnectors = [injected(), metaMask()];

const connectors = projectId
  ? [
      ...baseConnectors,
      walletConnect({
        projectId,
        metadata: {
          name: 'Web3 AI Copilot',
          description: 'Multi-chain Web3 dashboard with AI Copilot',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          icons: [],
        },
      }),
    ]
  : baseConnectors;

if (!projectId) {
  console.warn(
    'WalletConnect is not configured. Please set VITE_WALLET_CONNECT_PROJECT_ID in your environment variables.'
  );
}

export const wagmiConfig: Config = createConfig({
  chains: supportedChains,
  connectors,
  transports: {
    [supportedChains[0].id]: http(),
    [supportedChains[1].id]: http(),
    [supportedChains[2].id]: http(),
    [supportedChains[3].id]: http(),
    [supportedChains[4].id]: http(),
  },
});
