import React from 'react';
import Modal from '~/shared/ui/Modal/Modal';
import { UserAvatar } from '~/entities/user';
import { ModalFooter } from '~/shared/ui/Modal';
import type { RoomBanDetailsDto } from '../model/roomBan.types';

interface RoomBanDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    banDetails: RoomBanDetailsDto | null;
    onUnban: (roomBanId: string) => void;
    isUnbanning?: boolean;
}

export const RoomBanDetailsModal: React.FC<RoomBanDetailsModalProps> = ({
    isOpen,
    onClose,
    banDetails,
    onUnban,
    isUnbanning,
}) => {
    if (!banDetails) return null;

    const user = banDetails.user;
    const bannedBy = banDetails.bannedByUser;

    const formattedDate = banDetails.createdAt
        ? new Date(
            banDetails.createdAt.endsWith('Z') ? banDetails.createdAt : `${banDetails.createdAt}Z`
          ).toLocaleString('en-UK', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
          })
        : 'Н/Д';

    return (
        <Modal
            maxWidth="max-w-md"
            isOpen={isOpen}
            onClose={onClose}
            title="Ban Details"
        >
            <div className="flex flex-col justify-between min-h-full w-full text-foreground relative">
                
                <div className="flex flex-col gap-3.5 w-full pb-4">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-card/60 border border-border w-full min-w-0">
                        <UserAvatar
                            name={user.name}
                            src={user.img}
                            size="md"
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-sm font-bold truncate">
                                {user.name}
                            </span>
                            {user.nameTag && (
                                <span className="text-xs text-foreground-muted truncate">
                                    @{user.nameTag}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full min-w-0">
                        <span className="text-[10px] font-black uppercase text-foreground-muted tracking-[0.2em] italic opacity-70 px-0.5">
                            Reason
                        </span>
                        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs text-danger font-medium break-all max-h-32 overflow-y-auto custom-scrollbar">
                            {banDetails.reason || 'No reason provided'}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full min-w-0">
                        <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card/40 border border-border min-w-0">
                            <span className="text-[10px] font-black uppercase text-foreground-muted tracking-[0.2em] italic opacity-70">
                                Banned By
                            </span>
                            <div className="flex items-center gap-2 min-w-0">
                                {bannedBy ? (
                                    <>
                                        <UserAvatar
                                            name={bannedBy.name}
                                            src={bannedBy.img}
                                            size="sm"
                                        />
                                        <span className="text-xs font-semibold truncate">
                                            {bannedBy.name}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-xs text-foreground-muted italic">
                                        System / Admin
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-card/40 border border-border min-w-0">
                            <span className="text-[10px] font-black uppercase text-foreground-muted tracking-[0.2em] italic opacity-70">
                                Date & Time
                            </span>
                            <span className="text-xs font-semibold text-foreground/90 my-auto truncate">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-background shrink-0 pt-3 border-t border-border/40 sticky -bottom-6 -mb-6 z-10 -mx-6 px-6 pb-6">
                    <ModalFooter
                        onCancel={onClose}
                        onSave={() => {
                            onUnban(banDetails.id);
                            onClose();
                        }}
                        isSaving={isUnbanning}
                        saveLabel="Unban User"
                        cancelLabel="Close"
                        isOwn={true}
                    />
                </div>

            </div>
        </Modal>
    );
};