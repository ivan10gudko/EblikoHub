import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoriteTitlesApi } from "~/features/manageFavoriteTitles/api/favoriteTitlesApi";

export const useManageFavoriteTitles = (userId: string) => {
  const queryClient = useQueryClient();
  const userProfileQueryKey = ["user_profile", userId];

  const addFavoriteMutation = useMutation({
    mutationFn: ({ titleId, position }: { titleId: number; position: number }) =>
      favoriteTitlesApi.addFavorite(titleId, position),
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(userProfileQueryKey, updatedProfile);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (favoriteId: string) => favoriteTitlesApi.deleteFavorite(favoriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
  });

  return {
    addFavorite: addFavoriteMutation.mutate,
    isAdding: addFavoriteMutation.isPending,
    deleteFavorite: deleteFavoriteMutation.mutate,
    isDeleting: deleteFavoriteMutation.isPending,
  };
};