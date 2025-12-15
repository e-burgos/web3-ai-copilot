import { NftItem } from '@web3-ai-copilot/data-hooks';
import { create } from 'zustand';

interface NftStore {
  switchView: 'table' | 'gallery';
  nft: NftItem | null;
  openNftInfoModal: boolean;
  setSwitchView: (view: 'table' | 'gallery') => void;
  setNft: (nft: NftItem) => void;
  setOpenNftInfoModal: (open: boolean) => void;
}

export const useNftStore = create<NftStore>((set) => ({
  switchView: 'gallery',
  nft: null,
  openNftInfoModal: false,
  setSwitchView: (view: 'table' | 'gallery') => set({ switchView: view }),
  setNft: (nft: NftItem) => set({ nft }),
  setOpenNftInfoModal: (open: boolean) => set({ openNftInfoModal: open }),
}));
