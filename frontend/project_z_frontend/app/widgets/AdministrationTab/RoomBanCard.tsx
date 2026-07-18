import React, { useState } from 'react';
import { UserAvatar } from "~/entities/user";
import type { RoomBanDetailsDto } from '~/features/manageRooms/model/roomTitle.types';


interface AdditionalFields {
    username?: string;
    name?: string;
    nickname?: string;
    avatarUrl?: string;
    img?: string;
    reason?: string;
   
    user?: Record<string, string | undefined>;
}


type ExtendedRoomBanDetails = RoomBanDetailsDto & AdditionalFields;

interface RoomBanCardProps {
    banDetails: RoomBanDetailsDto;
    onUnban: (roomBanId: string) => Promise<void>;
}

export const RoomBanCard: React.FC<RoomBanCardProps> = ({ banDetails, onUnban }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    const extendedDetails = banDetails as ExtendedRoomBanDetails;

    
    const userInfo = extendedDetails.user || extendedDetails;

    const username = userInfo.username || userInfo.name || userInfo.nickname || `User #${banDetails.id}`;
    const avatarSrc = userInfo.avatarUrl || userInfo.img;
    const reason = extendedDetails.reason;

    const handleUnbanClick = async (event: React.MouseEvent) => {
        event.stopPropagation();

        
        setIsSubmitting(true);
        try {
            await onUnban(banDetails.id);
        } catch (error) {
            console.error("Failed to process unban:", error);
            
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-between gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] transition-all duration-200 group min-h-[96px] mb-3">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    
                    <UserAvatar
                        name={String(username)}
                        src={avatarSrc ? String(avatarSrc) : undefined}
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

            <div className="flex-shrink-0 z-10">
                <button
                    onClick={handleUnbanClick}
                    disabled={isSubmitting}
                    className="h-10 px-4 bg-primary/20 text-primary border border-primary hover:bg-primary/30 hover:text-primary-hover font-bold text-sm gap-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer"
                >
                    {isSubmitting ? '...' : 'Unban'}
                </button>
            </div>
        </div>
    );
};