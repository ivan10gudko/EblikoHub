
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from "react-router";
import { useRoomTitleLinkActions, useRoomTitleLinks } from "~/features/manageRooms";
import { Button } from "~/shared/ui/Button";
import { Modal } from "~/shared/ui/Modal";
import { LinkItem } from "../LinkItem";

interface LinksModalProps {

    roomTitleId: string;
    onClose: () => void;
    isOpen: boolean;
}

export const RoomTitleUserLinksModal = ({ roomTitleId, onClose, isOpen }: LinksModalProps) => {
    const { id: roomId } = useParams<{ id: string }>();

    const { data: links, isLoading, error } = useRoomTitleLinks(roomTitleId, Number(roomId));
    const { deleteLink } = useRoomTitleLinkActions(Number(roomId));
    const handleDelete = (linkId: string) => {
        deleteLink({ roomTitleLinkId: linkId, roomTitleId });
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} title="User Links" maxWidth="max-w-xl">
            <div className="flex flex-col h-[70vh]">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                    {isLoading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {links?.map((link) => (
                                <LinkItem
                                    key={link.id}
                                    title={link.title}
                                    onDelete={() => handleDelete(link.id)}
                                />
                            ))}
                            {links?.length === 0 && <p className="p-4 text-muted text-sm">No links found.</p>}
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-border mt-2 shrink-0">
                    <Button onClick={onClose} className="w-full h-12 rounded-xl !font-bold">
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};