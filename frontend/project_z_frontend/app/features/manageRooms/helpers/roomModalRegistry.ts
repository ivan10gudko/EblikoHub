
import { useQueryClient } from "@tanstack/react-query";
import { roomTitleKeys } from "~/features/manageRooms/model/roomTitle.queryKeys";
import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";

export function useCachedRoomTitle(roomId: number, titleId: string | null) {
  const queryClient = useQueryClient();
  if (!titleId) return undefined;

  const queries = queryClient.getQueriesData<{ pages: { content: RoomTitleDetails[] }[] }>({
    queryKey: roomTitleKeys.withLinks(roomId, ""),
    exact: false,
  });

  for (const [, data] of queries) {
    const found = data?.pages.flatMap(p => p.content).find(t => String(t.id) === titleId);
    if (found) return found;
  }
  return undefined;
}