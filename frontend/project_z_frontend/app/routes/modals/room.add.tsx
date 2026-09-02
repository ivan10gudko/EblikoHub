import { useNavigate, useSearchParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { AddRoomScreen } from "~/features/manageRoomSettings";

export default function RoomAddRoute() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const rawStep = parseInt(searchParams.get("step") || "1", 10);
    const step = Math.min(Math.max(Number.isNaN(rawStep) ? 1 : rawStep, 1), 2);

    const handleClose = () => {
        navigate(-1);
    };

    const handleStepChange = (newStep: number) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("step", String(newStep));
            return next;
        }, { replace: true });
    };

    return (
        <Modal isOpen={true} onClose={handleClose} title={`Create New Room (${step}/2)`} maxWidth="max-w-2xl">
            <AddRoomScreen onClose={handleClose} step={step} onStepChange={handleStepChange} />
        </Modal>
    );
}
