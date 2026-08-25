import { useState } from "react";
import { roomTitleService } from "~/features/manageRoomTitles/api/roomTitleService";
import { RoomTitleItem } from "./RoomTitleItem";
import { useAuthStore } from "~/features/auth";
import { useQuery } from "@tanstack/react-query";
import { useRoomModal } from "~/features/manageRoomSettings/hooks/useRoomModal";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { useRoomTitleActions, roomTitleKeys } from "~/features/manageRoomTitles"; // Імпортуємо roomTitleKeys
import { RoomRole } from "~/entities/room";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";

export const RoomTitlesManager = ({ roomId }: { roomId: number }) => {
    const { userId } = useAuthStore();
    const { openSettingsModal } = useRoomModal();

    const { data: currentUser } = useRoomMemberByRoomIdAndUserId(userId!, roomId);

    const isCurrentUserAdmin = currentUser?.role === RoomRole.ADMIN || currentUser?.role === RoomRole.OWNER;
    const { data: titles = [], isLoading } = useQuery({
        queryKey: [...roomTitleKeys.all, roomId],
        queryFn: () => roomTitleService.findAll(roomId),
    });

    const { deleteTitle, isPending } = useRoomTitleActions(roomId);

    if (isLoading) {
        return <div className="p-4 text-muted-foreground">Loading titles...</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Room Titles</h2>
                    <p className="text-sm text-muted-foreground">Manage the list of titles for this room</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => openSettingsModal('add-room-title', String(roomId))}
                        disabled={isPending}
                        className="h-10 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold border border-primary/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                        + Add Title
                    </button>
                </div>
            </div>

            {titles.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-border rounded-lg text-muted-foreground italic">
                    There are no titles added to this room yet.
                </div>
            ) : (
                <div className="grid gap-3">
                    {titles.map((item) => (
                        <RoomTitleItem
                            key={item.id}
                            item={item}
                            onDelete={deleteTitle}
                            defaultImagePath={DEFAULT_IMAGE_PATH}
                            isOwn={item.addedByUserId === userId}
                            isCurrentUserAdmin={isCurrentUserAdmin}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};