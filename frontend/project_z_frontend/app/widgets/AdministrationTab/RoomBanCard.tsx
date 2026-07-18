import React, { useState } from 'react';
import { UserAvatar } from "~/entities/user";
import type { RoomBanDetailsDto } from '~/features/manageRooms/model/roomTitle.types';

// Описуємо структуру користувача, якщо вона лежить на верхньому рівні
interface AdditionalFields {
    username?: string;
    name?: string;
    nickname?: string;
    avatarUrl?: string;
    img?: string;
    reason?: string;
    // Змінюємо тип на string, щоб він ідеально підходив під UserAvatarProps
    user?: Record<string, string | undefined>;
}

// Використовуємо перетин типів (&) замість extends
type ExtendedRoomBanDetails = RoomBanDetailsDto & AdditionalFields;

interface RoomBanCardProps {
    banDetails: RoomBanDetailsDto;
    onUnban: (roomBanId: string) => Promise<void>;
}

export const RoomBanCard: React.FC<RoomBanCardProps> = ({ banDetails, onUnban }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Безпечно приводимо до нашого типу, де дозволені додаткові поля
    const extendedDetails = banDetails as ExtendedRoomBanDetails;

    // Перевіряємо, де саме лежать дані профайлу: у вкладеному об'єкті user чи на верхньому рівні
    const userInfo = extendedDetails.user || extendedDetails;

    const username = userInfo.username || userInfo.name || userInfo.nickname || `User #${banDetails.id}`;
    const avatarSrc = userInfo.avatarUrl || userInfo.img;
    const reason = extendedDetails.reason;

    const handleUnbanClick = async (event: React.MouseEvent) => {
        event.stopPropagation();

        // Більше немає жодних confirm() вікон, розбан йде одразу по кліку
        setIsSubmitting(true);
        try {
            await onUnban(banDetails.id);
        } catch (error) {
            console.error("Failed to process unban:", error);
            // Обов'язково повертаємо кнопку в робочий стан, якщо бекенд повернув 403
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex items-center justify-between gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] transition-all duration-200 group min-h-[96px] mb-3">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    {/* Конвертуємо змінні у String, щоб TypeScript більше не сварився на типи */}
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
                    className="text-xs font-semibold px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none rounded-xl transition-all duration-200 shadow-sm"
                >
                    {isSubmitting ? '...' : 'Unban'}
                </button>
            </div>
        </div>
    );
};