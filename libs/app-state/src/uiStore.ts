import { create } from 'zustand';

interface UIState {
  chatOpen: boolean;
  selectedToken: string | null;
  setChatOpen: (open: boolean) => void;
  setSelectedToken: (token: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  chatOpen: false,
  selectedToken: null,
  setChatOpen: (open: boolean) => set({ chatOpen: open }),
  setSelectedToken: (token: string | null) => set({ selectedToken: token }),
}));

