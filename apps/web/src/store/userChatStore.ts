import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { IChatMessage } from '../types';

interface ChatHistory {
  messages: IChatMessage[];
  lastUpdated: number;
}

interface ChatHistories {
  [walletAddress: string]: ChatHistory;
}

interface UserChatStore {
  chatOpen: boolean;
  selectedToken: string | null;
  // Chat histories keyed by wallet address
  chatHistories: ChatHistories;
  // Current wallet address for chat context
  currentWalletAddress: string | null;
  setChatOpen: (open: boolean) => void;
  setSelectedToken: (token: string | null) => void;
  // Chat history methods
  getMessages: (walletAddress?: string | null) => IChatMessage[];
  addMessage: (message: IChatMessage, walletAddress?: string | null) => void;
  addMessages: (
    messages: IChatMessage[],
    walletAddress?: string | null
  ) => void;
  clearHistory: (walletAddress?: string | null) => void;
  setCurrentWalletAddress: (address: string | null) => void;
}

const getWalletKey = (walletAddress?: string | null): string => {
  return walletAddress || 'default';
};

export const userChatStore = create<UserChatStore>()(
  persist(
    (set, get) => ({
      chatOpen: false,
      selectedToken: null,
      chatHistories: {},
      currentWalletAddress: null,

      setChatOpen: (open: boolean) => set({ chatOpen: open }),

      setSelectedToken: (token: string | null) => set({ selectedToken: token }),

      setCurrentWalletAddress: (address: string | null) => {
        set({ currentWalletAddress: address });
      },

      getMessages: (walletAddress?: string | null) => {
        const key = getWalletKey(walletAddress || get().currentWalletAddress);
        const history = get().chatHistories[key];
        return history?.messages || [];
      },

      addMessage: (message: IChatMessage, walletAddress?: string | null) => {
        const key = getWalletKey(walletAddress || get().currentWalletAddress);
        set((state) => {
          const currentHistory = state.chatHistories[key] || {
            messages: [],
            lastUpdated: Date.now(),
          };
          return {
            chatHistories: {
              ...state.chatHistories,
              [key]: {
                messages: [...currentHistory.messages, message],
                lastUpdated: Date.now(),
              },
            },
          };
        });
      },

      addMessages: (
        messages: IChatMessage[],
        walletAddress?: string | null
      ) => {
        const key = getWalletKey(walletAddress || get().currentWalletAddress);
        set((state) => {
          const currentHistory = state.chatHistories[key] || {
            messages: [],
            lastUpdated: Date.now(),
          };
          return {
            chatHistories: {
              ...state.chatHistories,
              [key]: {
                messages: [...currentHistory.messages, ...messages],
                lastUpdated: Date.now(),
              },
            },
          };
        });
      },

      clearHistory: (walletAddress?: string | null) => {
        const key = getWalletKey(walletAddress || get().currentWalletAddress);
        set((state) => {
          const newHistories = { ...state.chatHistories };
          delete newHistories[key];
          return { chatHistories: newHistories };
        });
      },
    }),
    {
      name: 'web3-ai-copilot-chat-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist chat histories and current wallet address
      partialize: (state) => ({
        chatHistories: state.chatHistories,
        currentWalletAddress: state.currentWalletAddress,
      }),
    }
  )
);
