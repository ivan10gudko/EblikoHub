import { useQuery } from "@tanstack/react-query";
import { seasonService } from "../api/SeasonService";
import { SeasonsKeys } from "../model/season.queryKeys";

export const useSeasonById = (seasonId?: number | null) => {
    const queryKey = SeasonsKeys.detail(seasonId!);

    const { data: season, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: () => seasonService.getById(seasonId!),
        enabled: !!seasonId,
        staleTime: 0,
    });

    return {
        season: season || null,
        isLoading,
        error,
        refetch,
    };
};