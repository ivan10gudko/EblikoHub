import { useNavigate, useParams } from "react-router";
import { ViewAllRoomTitleLinksScreen } from "~/features/manageRoomTitles";
import { Modal } from "~/shared/ui/Modal";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import { useAuthStore } from "~/features/auth";
import { RoomRole } from "~/entities/room";

export default function RoomTitleLinksRoute() {
    const navigate = useNavigate();
    const { id, titleId } = useParams();
    const userId = useAuthStore((state) => state.userId);

    const handleClose = () => {
        navigate(-1);
    };

    const roomId = Number(id);
    const { data: currentMember } = useRoomMemberByRoomIdAndUserId(userId ?? null, roomId);

    const canDeleteLinks =
        currentMember?.role === RoomRole.OWNER || currentMember?.role === RoomRole.ADMIN;

    return (
        <Modal isOpen={true} onClose={handleClose} title="Title Links" maxWidth="max-w-xl">
            <ViewAllRoomTitleLinksScreen 
                onClose={handleClose} 
                roomId={roomId} 
                roomTitleId={titleId ?? ""} 
                canDelete={canDeleteLinks} 
            />
        </Modal>
    );
}
