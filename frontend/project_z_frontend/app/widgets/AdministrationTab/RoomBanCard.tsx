import React from 'react';
import { UserAvatar } from "~/entities/user";
import type { RoomBanDetailsDto } from '~/features/manageRoomBans';
import Button from '~/shared/ui/Button/Button';

interface RoomBanCardProps {
    banDetails: RoomBanDetailsDto;
    onUnban: (roomBanId: string) => void;
    onClick?: () => void;
}

export const RoomBanCard: React.FC<RoomBanCardProps> = ({ 
    banDetails, 
    onUnban, 
    onClick 
}) => {
    const user = banDetails.user;
    const username = user.name;
    const avatarSrc = user.img;
    const reason = banDetails.reason;

    const formattedReason = reason 
        ? reason.length > 60 
            ? `${reason.slice(0, 60)}...` 
            : reason 
        : null;

    const handleUnbanClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onUnban(banDetails.id);
    };

    return (
        <div 
            onClick={onClick}
            className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl cursor-pointer transition-all duration-200 group min-h-[96px] mb-3 w-full overflow-hidden"
        >
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1 overflow-hidden">
                <div className="flex-shrink-0 transition-transform duration-200">
                    <UserAvatar
                        name={username}
                        src={avatarSrc}
                        size="md"
                    />
                </div>

                <div className="flex flex-col min-w-0 flex-1 pr-2 overflow-hidden">
                    <span className="text-sm font-bold text-foreground truncate tracking-wide transition-colors">
                        {username}
                    </span>

                    {formattedReason && (
                        <p className="text-xs text-danger font-medium mt-1 line-clamp-2 break-all max-w-full">
                            <span className="font-semibold">Reason:</span> {formattedReason}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0 z-10 w-full sm:w-auto self-end sm:self-center">
                <Button
                    onClick={handleUnbanClick}
                    className="w-full sm:w-auto bg-primary text-background hover:bg-primary-hover 
                    h-9 px-4 rounded-xl shadow-md active:scale-95 transition-all 
                    shrink-0 font-black uppercase text-[10px] tracking-wider 
                    border-2 border-primary/30 hover:border-primary/60 
                    cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
                >
                    Unban
                </Button>
            </div>
        </div>
    );
};