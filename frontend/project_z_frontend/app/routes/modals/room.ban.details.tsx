import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { RoomBanDetailsScreen, useRoomBans } from "~/features/manageRoomBans";
import { useDeleteRoomBan } from "~/features/manageRoomBans/hooks/useDeleteRoomBan";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";

export default function RoomBanDetailsRoute() {
    const navigate = useNavigate();
    const { id, banId } = useParams();

    const handleClose = () => {
        navigate(-1);
    };

    const roomId = Number(id);
    const { data: bannedUsers = [], isLoading } = useRoomBans(roomId);

    const { mutate: unbanUser, isPending: isUnbanning } = useDeleteRoomBan(roomId);

    if (isLoading) {
        return (
            <Modal isOpen={true} onClose={handleClose} title="Loading..." maxWidth="max-w-2xl">
                <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
                    Loading...
                </div>
            </Modal>
        );
    }

    const banDetails = bannedUsers.find(b => b.id === banId);

    if (!banDetails) {
        return <ErrorAnimePage />;
    }

    return (
        <Modal isOpen={true} onClose={handleClose} title="Ban Details" maxWidth="max-w-md">
            <RoomBanDetailsScreen
                onClose={handleClose}
                banDetails={banDetails}
                onUnban={unbanUser}
                isUnbanning={isUnbanning}
            />
        </Modal>
    );
}
