import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { UpdateSeasonDto, Season } from "../model/season.types";
import { seasonService } from "../api/SeasonService";

export const useSeasonActions = (titleId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["seasons", titleId];

  const updateMutation = useMutation({
    mutationFn: ({ seasonId, data }: { seasonId: number; data: UpdateSeasonDto }) =>
      seasonService.patch(seasonId, data),
    onSuccess: (updatedSeason) => {
      queryClient.setQueryData<Season[]>(queryKey, (old) =>
        old?.map((s) => (s.seasonId === updatedSeason.seasonId ? updatedSeason : s))
      );
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (seasonId: number) => seasonService.delete(seasonId),
    onSuccess: (_, seasonId) => {
      queryClient.setQueryData<Season[]>(queryKey, (old) =>
        old?.filter((s) => s.seasonId !== seasonId)
      );
      toast.success("Season deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  });

  return {
    updateSeason: (seasonId: number, data: UpdateSeasonDto) => 
      updateMutation.mutate({ seasonId, data }),
    deleteSeason: (seasonId: number) => 
      deleteMutation.mutate(seasonId),
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};