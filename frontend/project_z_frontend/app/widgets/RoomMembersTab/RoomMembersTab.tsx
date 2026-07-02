import React from "react";
import { RoomMemberCard } from "./RoomMemberCard";
import type { Room } from "~/entities/room/model/room.types";

interface RoomMembersTabProps {
    room: Room;
    currentUserId: number | string;
}

export const RoomMembersTab: React.FC<RoomMembersTabProps> = ({ room, currentUserId }) => {
    const members = room?.members || [];
    const roomOwnerId =room.owner;

    const currentUser = members.find(m => String(m.user?.userId) === String(currentUserId));
    const currentUserRole = currentUser?.role || "MEMBER";

    const isCurrentUserAdmin = currentUserRole === "ADMIN" || currentUserRole === "OWNER";

    if (members.length === 0) {
        return (
            <div className="w-full text-center p-8 bg-(--background-muted) rounded-2xl border border-(--border) text-(--foreground-muted)/60 italic text-sm">
                No members found in this room.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-1">
                <h2 className="text-xl font-bold text-foreground">Members</h2>
                <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold">
                    {members.length}
                </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                    <RoomMemberCard
                        key={member.user?.userId}
                        member={member}
                        roomOwnerId={room.owner}
                        currentUserId={currentUserId}
                        isCurrentUserAdmin={isCurrentUserAdmin}
                    />
                ))}
            </div>
        </div>
    );
};