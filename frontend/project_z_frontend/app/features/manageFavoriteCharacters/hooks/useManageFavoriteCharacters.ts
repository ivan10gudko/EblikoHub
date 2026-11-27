import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";
import type { UserProfileWithFavorite } from "~/features/profile/model/profile.types";
import { favoriteCharactersApi } from "../api/favoriteCharactersApi";

export const useManageFavoriteCharacters = (userId: string) => {
  const queryClient = useQueryClient();
  const userProfileQueryKey = ["user_profile", userId];

  const addFavoriteMutation = useMutation({
    mutationFn: ({ characterId, position }: { characterId: string; position: number }) =>
      favoriteCharactersApi.addFavorite(characterId, position),
    onSuccess: (updatedProfile) => {
      // keep friendship fields that the endpoint doesn't return
      queryClient.setQueryData<UserProfileWithFavorite>(userProfileQueryKey, (old) =>
        old ? { ...old, favoriteCharacters: updatedProfile.favoriteCharacters } : updatedProfile
      );
    },
    onError: (error) => notify.error(getErrorMessage(error, "Could not add favorite character")),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userProfileQueryKey });
    },
  });

  const deleteFavoriteMutation = useMutation({
    mutationFn: (favoriteId: string) => favoriteCharactersApi.deleteFavorite(favoriteId),
    onMutate: async (favoriteId) => {
      await queryClient.cancelQueries({ queryKey: userProfileQueryKey });
      const previous = queryClient.getQueryData<UserProfileWithFavorite>(userProfileQueryKey);
      queryClient.setQueryData<UserProfileWithFavorite>(userProfileQueryKey, (old) =>
        old
          ? {
              ...old,
              favoriteCharacters: (old.favoriteCharacters ?? []).filter((f) => f.id !== favoriteId),
            }
          : old
      );
      return { previous };
    },
    onError: (error, _id, context) => {
      queryClient.setQueryData(userProfileQueryKey, context?.previous);
      notify.error(getErrorMessage(error, "Could not remove favorite character"));
    },
    onSettled: () => {
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
