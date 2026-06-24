import { useQuery } from "@tanstack/react-query";

import { titleRecordService } from "~/entities/titleRecord/api/titleRecordService";
import type { TitleStats } from "~/entities/titleRecord/model/titleRecord";



export function useTitleStats(userId: string | null) {
  return useQuery<TitleStats>({
    queryKey: ["titles", "stats", userId],
    queryFn: () => titleRecordService.getTitleStats(userId!),
  });
}