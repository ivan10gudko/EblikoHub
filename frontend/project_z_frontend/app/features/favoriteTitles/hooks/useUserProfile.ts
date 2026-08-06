import { useSuspenseQuery } from '@tanstack/react-query';
import { favoriteTitlesApi } from '../api/favoriteTitlesApi';

export const useUserProfile = (userId: string) => {
  return useSuspenseQuery({
    queryKey: ['user_profile', userId],
    queryFn: () => favoriteTitlesApi.getUserProfile(userId),
    staleTime: 1000 * 60 * 5,
  });
};