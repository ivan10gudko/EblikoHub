import { useNavigate, useParams } from "react-router";
import { AddRoomTitleScreen } from "~/features/manageRoomTitles";
import { Modal } from "~/shared/ui/Modal";

export default function RoomTitleAddRoute() {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleClose = () => {
        navigate(-1);
    };

    return (
        <Modal isOpen={true} onClose={handleClose} title="Add New Room Title" maxWidth="max-w-2xl">
            <AddRoomTitleScreen onClose={handleClose} roomId={Number(id)} />
        </Modal>
    );
}
