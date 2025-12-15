import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletStore } from '../store/walletStore';
import { useEffect } from 'react';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { setAddress, setIsConnected, reset } = useWalletStore();

  useEffect(() => {
    if (address && isConnected) {
      setAddress(address);
      setIsConnected(true);
    } else {
      reset();
    }
  }, [address, isConnected, setAddress, setIsConnected, reset]);

  const connectWallet = async (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId);
    if (connector) {
      connect({ connector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
    reset();
  };

  return {
    address,
    isConnected,
    connectors,
    isPending,
    connectWallet,
    disconnectWallet,
  };
}
