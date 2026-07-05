import { useState, useEffect } from "react";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";
import { AddRoomTitleModal } from "./AddRoomTitleModal";
import { RoomTitleItem } from "./RoomTitleItem";
import { useAuthStore } from "~/features/auth";
import { RoomRole, useRoomDetails } from "~/entities/room";
import { useQuery } from "@tanstack/react-query";

export const RoomTitlesManager = ({ roomId }: { roomId: number }) => {
    const { userId } = useAuthStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
    const { room } = useRoomDetails(roomId)
    const currentUser = room?.members.find(member => member.user.userId == userId);
    const { data: titles = [], isLoading, refetch } = useQuery({
        queryKey: ["roomTitles", roomId],
        queryFn: () => roomTitleService.findAll(roomId),
    });

    const handleDelete = async (titleId: string) => {
        try {
            await roomTitleService.deleteTitle(roomId, titleId);
            refetch();
        } catch (error) {
            console.error("Error deleting room title:", error);
        }
    };

    if (isLoading) {
        return <div className="p-4 text-muted-foreground">Loading titles...</div>;
    }

    return (
        <div className="p-6 bg-card rounded-xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-foreground">Room Titles</h2>
                    <p className="text-sm text-muted-foreground">Manage the list of titles for this room</p>
                </div>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="h-10  px-4  py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold border border-primary/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                    + Add Title
                </button>
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
                            onDelete={handleDelete}
                            defaultImagePath={DEFAULT_IMAGE_PATH}
                            roomId={roomId}
                            isOwn={item.addedByUserId==userId? true:false}
                            isCurrentUserAdmin={isCurrentUserAdmin}
                        />
                    ))}
                </div>
            )}

            <AddRoomTitleModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => refetch()}
                roomId={roomId}
            />
        </div>
    );
};