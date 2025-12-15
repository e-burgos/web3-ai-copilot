import { WalletConnected } from './WalletConnected';
import { WalletDisconnected } from './WalletDisconnected';
import { useWallet } from '@web3-ai-copilot/wallet';

export const RightHeaderContent = () => {
  const { address, isConnected } = useWallet();

  if (isConnected && address) {
    return <WalletConnected />;
  }

  return <WalletDisconnected />;
};
