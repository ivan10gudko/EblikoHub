
import { useNavigate, useParams } from "react-router";
import { AddSeasonScreen } from "~/features/manageSeason";
import { Modal } from "~/shared/ui/Modal";


export default function AddSeasonRoute() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate(-1);
    };
    const { titleId } = useParams();

    return (
        <Modal isOpen={true} onClose={handleClose} title="Add New Season" maxWidth="max-w-2xl">
            <AddSeasonScreen onClose={handleClose} titleId={Number(titleId)}/>
        </Modal>
    );
}