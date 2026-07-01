import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateSeasonDto, Season, DraftSeason } from "../model/season.types";
import { seasonService } from "../api/SeasonService";
import { notify } from "~/shared/lib";

export const useSeasonActions = (titleId: number, onClose?: () => void) => {
  const queryClient = useQueryClient();
  const queryKey = ["seasons", titleId];

  const syncMutation = useMutation({
    mutationFn: (localSeasons: Array<DraftSeason & { localId: string }>) => {
      const cleanSeasons: DraftSeason[] = localSeasons.map(({ localId: _localId, ...rest }) => rest);
      return seasonService.sync(titleId, cleanSeasons);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      notify.success("Updated!");
      if (onClose) onClose();
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Sync failed");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ seasonId, data }: { seasonId: number; data: UpdateSeasonDto }) =>
      seasonService.patch(seasonId, data),
    onSuccess: (updatedSeason) => {
      queryClient.setQueryData<Season[]>(queryKey, (old) =>
        old?.map((s) => (s.seasonId === updatedSeason.seasonId ? updatedSeason : s))
      );
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Update failed");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (seasonId: number) => seasonService.delete(seasonId),
    onSuccess: (_, seasonId) => {
      queryClient.setQueryData<Season[]>(queryKey, (old) =>
        old?.filter((s) => s.seasonId !== seasonId)
      );
      notify.success("Season deleted");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Delete failed");
    }
  });

  return {
    syncSeasons: (localSeasons: Array<DraftSeason & { localId: string }>) =>
      syncMutation.mutate(localSeasons),
    isSyncing: syncMutation.isPending,

    updateSeason: (seasonId: number, data: UpdateSeasonDto) =>
      updateMutation.mutate({ seasonId, data }),
    deleteSeason: (seasonId: number) =>
      deleteMutation.mutate(seasonId),
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};