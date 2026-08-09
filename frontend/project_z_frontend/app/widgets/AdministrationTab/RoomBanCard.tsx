import React from 'react';
import { UserAvatar } from "~/entities/user";
import type { RoomBanDetailsDto } from '~/features/manageRooms/model/roomTitle.types';
import Button from '~/shared/ui/Button/Button';

interface RoomBanCardProps {
    banDetails: RoomBanDetailsDto;
    onUnban: (roomBanId: string) => void;
}

export const RoomBanCard: React.FC<RoomBanCardProps> = ({ banDetails, onUnban }) => {
    const user = banDetails.user;
    const username = user.name;
    const avatarSrc = user.img;
    const reason = banDetails.reason;

    const handleUnbanClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onUnban(banDetails.id);
    };

    return (
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] cursor-pointer transition-all duration-200 group min-h-[96px] mb-3">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <UserAvatar
                        name={username}
                        src={avatarSrc}
                        size="md"
                    />
                </div>

                <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-bold text-foreground truncate tracking-wide group-hover:text-primary transition-colors">
                        {username}
                    </span>

                    {reason && (
                        <span className="text-xs text-danger font-medium truncate mt-1">
                            Reason: {reason}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 z-10 w-full sm:w-auto">
                <Button
                    onClick={handleUnbanClick}
                    variant="accept"
                    className="h-10 w-full md:h-12 sm:w-24 text-lg"
                >
                    Unban
                </Button>
            </div>
        </div>
    );
};