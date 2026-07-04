import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import { notify } from "~/shared/lib";
import type { RoomTitleLinkCreate, RoomTitleLinkShort, RoomTitleWithUserLinks } from "~/features/manageRooms/model/roomTitle.types";
import type { PageResponse } from "~/shared/types";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";
import { titleRecordKeys } from "~/entities/titleRecord/model/titleRecord.queryKeys";
export const useRoomTitleLinkActions = (roomId: number, userId: string) => {
    const queryClient = useQueryClient();
    const queryKey = roomTitleKeys.withLinks(roomId, userId);

    const { mutate, isPending } = useMutation({
        mutationFn: (dto: RoomTitleLinkCreate) =>
            roomTitleService.createRoomTitleLink(roomId, dto),

        onMutate: async (dto: RoomTitleLinkCreate) => {
            await queryClient.cancelQueries({ queryKey, exact: false });

            queryClient.setQueriesData<InfiniteData<PageResponse<RoomTitleWithUserLinks>>>(
                { queryKey, exact: false },
                (oldData) => {
                    if (!oldData) return undefined;
                    return updateInfiniteQuery<PageResponse<RoomTitleWithUserLinks>, RoomTitleWithUserLinks>({
                        oldData,
                        getContent: (page) => page.content,
                        setContent: (page, newContent) => ({ ...page, content: newContent }),
                        updater: (allItems) => allItems.map((title) =>
                            String(title.id) === String(dto.roomTitleId)
                                ? {
                                    ...title,
                                    links: [
                                        ...title.links,
                                        {
                                            id: "temp-id-" + Date.now(),
                                            roomTitleId: String(dto.roomTitleId),
                                            title: { titleId: dto.titleId },
                                            createdAt: new Date().toISOString(),
                                        } as RoomTitleLinkShort
                                    ]
                                }
                                : title
                        )
                    });
                }
            );
        },

        onError: (err) => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            notify.error("Failed to create link");
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            queryClient.invalidateQueries({ queryKey: titleRecordKeys.all });
            notify.success("Link created successfully");
        }
    });

    return { createLink: mutate, isPending };
};