import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  reset: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      setAddress: (address: string | null) => set({ address }),
      setIsConnected: (isConnected: boolean) => set({ isConnected }),
      reset: () => set({ address: null, isConnected: false }),
    }),
    {
      name: 'wallet-storage',
    }
  )
);

