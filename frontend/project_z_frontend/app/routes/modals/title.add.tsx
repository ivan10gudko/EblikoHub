
import { useNavigate } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { AddTitleScreen } from "~/widgets/TitleModal";


export default function AddRoute() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate("..", { relative: "path" });
    };

    return (
        <Modal isOpen={true} onClose={handleClose} title="Add New Title" maxWidth="max-w-2xl">
            <AddTitleScreen />
        </Modal>
    );
}