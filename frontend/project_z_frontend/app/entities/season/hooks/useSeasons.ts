import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateSeasonDto, Season } from "../model/season.types";
import { seasonService } from "../api/SeasonService";
import { notify } from "~/shared/lib";

export const useSeasons = (titleId: number) => {
  const queryClient = useQueryClient();
  const queryKey = ["seasons", titleId];

  const { data: seasons, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: () => seasonService.getAllByTitleId(titleId),
    enabled: !!titleId,
    staleTime: 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSeasonDto) => seasonService.create(titleId, data),
    onSuccess: (newSeason: Season) => {
      queryClient.setQueryData<Season[]>(queryKey, (old) =>
        old ? [...old, newSeason] : [newSeason]
      );
      notify.success("Season added!");
    },
    onError: (error: any) => {
      notify.error(error.response?.data?.message || "Failed to add season");
    }
  });

  return {
    seasons: seasons || [],
    refetch,
    createSeason: createMutation.mutate,
    isPending: createMutation.isPending || isLoading,
  };
};