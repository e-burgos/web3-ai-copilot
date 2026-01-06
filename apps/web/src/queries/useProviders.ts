import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AI_GATEWAY_URL } from '../utils/constants';

export interface Provider {
  name: string;
  available: boolean;
  models: string[];
}

export interface ProvidersResponse {
  providers: Provider[];
}

export const useProviders = () => {
  return useQuery<ProvidersResponse>({
    queryKey: ['providers'],
    queryFn: async () => {
      const response = await axios.get<ProvidersResponse>(
        `${AI_GATEWAY_URL}/api/providers`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useGroqAvailable = () => {
  const { data } = useProviders();
  const groqProvider = data?.providers.find((p) => p.name === 'groq');
  return {
    isAvailable: groqProvider?.available ?? false,
    models: groqProvider?.models ?? [],
  };
};
