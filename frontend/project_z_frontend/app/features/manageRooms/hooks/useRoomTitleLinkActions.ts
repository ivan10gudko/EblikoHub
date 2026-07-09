import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import { notify } from "~/shared/lib";
import type { RoomTitleLinkCreate, RoomTitleLinkShort, RoomTitleWithUserLinks } from "~/features/manageRooms/model/roomTitle.types";
import type { PageResponse } from "~/shared/types";
import { updateInfiniteQuery } from "~/shared/helpers/updateInfinityQuery";
import { roomTitleKeys } from "../model/roomTitle.queryKeys";
import { titleRecordKeys } from "~/entities/titleRecord/model/titleRecord.queryKeys";

export const useRoomTitleLinkActions = (roomId: number) => {
    const queryClient = useQueryClient();
    const queryKey = roomTitleKeys.withLinksBase(roomId);

    const { mutate: createLink, isPending: isCreating } = useMutation({
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

        onError: (err, dto) => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            queryClient.invalidateQueries({ queryKey: roomTitleKeys.userLinks(roomId, String(dto.roomTitleId)) });
            notify.error("Failed to create link");
        },

        onSuccess: (_data, dto) => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            queryClient.invalidateQueries({ queryKey: roomTitleKeys.userLinks(roomId, String(dto.roomTitleId)) });
            queryClient.invalidateQueries({ queryKey: titleRecordKeys.all });
            notify.success("Link created successfully");
        }
    });

    const { mutate: deleteLink, isPending: isDeleting } = useMutation({
        mutationFn: ({ roomTitleLinkId }: { roomTitleLinkId: string; roomTitleId: string }) =>
            roomTitleService.deleteRoomTitleLink(roomId, roomTitleLinkId),

        onMutate: async ({ roomTitleLinkId }) => {
            await queryClient.cancelQueries({ queryKey, exact: false });

            queryClient.setQueriesData<InfiniteData<PageResponse<RoomTitleWithUserLinks>>>(
                { queryKey, exact: false },
                (oldData) => {
                    if (!oldData) return undefined;
                    return updateInfiniteQuery<PageResponse<RoomTitleWithUserLinks>, RoomTitleWithUserLinks>({
                        oldData,
                        getContent: (page) => page.content,
                        setContent: (page, newContent) => ({ ...page, content: newContent }),
                        updater: (allItems) => allItems.map((title) => ({
                            ...title,
                            links: title.links.filter(link => String(link.id) !== String(roomTitleLinkId))
                        }))
                    });
                }
            );
        },

        onError: (err, { roomTitleId }) => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            queryClient.invalidateQueries({ queryKey: roomTitleKeys.userLinks(roomId, roomTitleId) });
            notify.error("Failed to delete link");
        },

        onSuccess: (_data, { roomTitleId }) => {
            queryClient.invalidateQueries({ queryKey, exact: false });
            queryClient.invalidateQueries({ queryKey: roomTitleKeys.userLinks(roomId, roomTitleId) });
            queryClient.invalidateQueries({ queryKey: titleRecordKeys.all });
            notify.success("Link deleted successfully");
        }
    });

    return {
        createLink,
        isCreating,
        deleteLink,
        isDeleting
    };
};