import { useToastStore } from '@e-burgos/tucu-ui';
import { IChatMessage } from '../types';
import { AI_GATEWAY_URL } from '../utils/constants';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import axios from 'axios';
import { CombinedPortfolioData } from '@web3-ai-copilot/data-hooks';

export const useSendAiMessageMutation = (): UseMutationResult<
  IChatMessage,
  Error,
  { messages: IChatMessage[]; portfolioData: CombinedPortfolioData | null },
  unknown
> => {
  const { addToast } = useToastStore();
  return useMutation({
    mutationFn: async ({
      messages,
      portfolioData,
    }: {
      messages: IChatMessage[];
      portfolioData: CombinedPortfolioData | null;
    }) => {
      const response = await axios.post(
        `${AI_GATEWAY_URL}/api/chat`,
        {
          messages,
          portfolioData,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        role: 'assistant',
        content: response.data.content,
      };
    },
    onError: () => {
      addToast({
        id: 'export-error',
        title: 'Export Failed',
        message: 'Failed to get AI response',
        variant: 'destructive',
      });
    },
  });
};
