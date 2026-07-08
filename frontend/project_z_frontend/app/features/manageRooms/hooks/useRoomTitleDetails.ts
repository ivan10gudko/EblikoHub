import { useQuery } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import { roomTitleKeys } from "~/features/manageRooms/model/roomTitle.queryKeys";

export const useRoomTitleDetails = (roomId: number, roomTitleId: string | null) => {
  return useQuery({
    queryKey: roomTitleKeys.details(roomId, roomTitleId ?? ""),
    queryFn: () => roomTitleService.findRoomTitleById(roomId, roomTitleId as string),
    enabled: !!roomTitleId,
    staleTime: 1000 * 60 * 5,
  });
};