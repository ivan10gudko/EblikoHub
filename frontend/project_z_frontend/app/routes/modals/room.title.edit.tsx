import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { RoomRole } from "~/entities/room";
import { useAuthStore } from "~/features/auth";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { EditRoomTitleScreen, useRoomTitleDetails } from "~/features/manageRoomTitles";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { notify } from "~/shared/lib";
import { Modal } from "~/shared/ui/Modal";

export default function RoomTitleEditRoute() {
    const navigate = useNavigate();
    const { id, titleId } = useParams();

    const handleClose = () => {
        navigate(-1);
    };

    const roomId = Number(id);
    const { data: item, isLoading: isItemLoading } = useRoomTitleDetails(roomId, titleId ?? null);

    const currentUserId = useAuthStore((state) => state.userId);
    const { data: currentMember, isLoading: isMemberLoading } = useRoomMemberByRoomIdAndUserId(currentUserId, roomId);
    const isAuthReady = currentUserId !== undefined;
    const isLoading = isItemLoading || isMemberLoading || !isAuthReady;

    const canEdit = useMemo(
        () => Boolean(
            currentUserId && (
                currentUserId === item?.addedByUserId ||
                currentMember?.role === RoomRole.ADMIN ||
                currentMember?.role === RoomRole.OWNER
            )
        ),
        [currentUserId, item, currentMember],
    );

    useEffect(() => {
        if (!isLoading && item && !canEdit) {
            notify.error("You do not have permission to edit this title!");
            navigate(`../links/${titleId}`,);
        }
    }, [isLoading, item, canEdit, navigate, titleId]);

    const showPlaceholder = isLoading || (item !== undefined && !canEdit);

    if (showPlaceholder) {
        return (
            <Modal isOpen={true} onClose={handleClose} title="Loading..." maxWidth="max-w-2xl">
                <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
                    Loading title...
                </div>
            </Modal>
        );
    }

    if (!item) {
        return <ErrorAnimePage />;
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title="Edit Room Title" maxWidth="max-w-2xl">
            <EditRoomTitleScreen onClose={handleClose} roomId={roomId} item={item} />
        </Modal>
    );
}