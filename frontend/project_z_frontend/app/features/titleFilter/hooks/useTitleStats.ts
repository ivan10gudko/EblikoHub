import { useQuery } from "@tanstack/react-query";

import { titleRecordService, type TitleStats } from "~/entities/titleRecord";



export function useTitleStats(userId: string | null) {
  return useQuery<TitleStats>({
    queryKey: ["titles", "stats", userId],
    queryFn: () => titleRecordService.getTitleStats(userId!),
  });
}