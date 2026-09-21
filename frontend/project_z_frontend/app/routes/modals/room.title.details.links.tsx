import { useNavigate, useParams } from "react-router";
import { AddRoomTitleScreen, RoomTitleDetailsLinksScreen, useRoomTitleWithLinks } from "~/features/manageRoomTitles";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { notify } from "~/shared/lib";
import { Modal } from "~/shared/ui/Modal";

export default function RoomTitleDetailsLinksRoute() {
    const navigate = useNavigate();
    const { id, titleId } = useParams();

    const handleClose = () => {
        navigate("../..", { relative: "path", replace: true });
    };
    const roomId = Number(id);
    const { data, isLoading } = useRoomTitleWithLinks(roomId, titleId!);

    if (isLoading) {
        return (
            <Modal isOpen={true} onClose={handleClose} title="Loading..." maxWidth="max-w-2xl">
                <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
                    Loading title...
                </div>
            </Modal>
        );
    }

    if (!data) {
        notify.error("Error while fething room title");
        return (
            <Modal isOpen={true} onClose={handleClose} title="Loading..." maxWidth="max-w-2xl">
                <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
                    Error while fetching room title
                </div>
            </Modal>
        );
    };


    return (
        <Modal isOpen={true} onClose={handleClose} title="View room title details links" maxWidth="max-w-5xl">
            <RoomTitleDetailsLinksScreen data={data} />
        </Modal>
    );
}
