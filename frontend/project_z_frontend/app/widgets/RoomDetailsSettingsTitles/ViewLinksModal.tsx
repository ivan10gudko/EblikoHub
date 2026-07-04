import { useEffect, useState } from "react";
import Modal from "~/shared/ui/Modal/Modal";
import { apiClient } from "~/shared/api";
import type { RoomTitleLinkDetailsDto } from "~/features/manageRooms/model/roomTitle.types";

interface ViewLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  roomTitleId: string;
}

export const ViewLinksModal = ({ isOpen, onClose, roomId, roomTitleId }: ViewLinksModalProps) => {
  const [links, setLinks] = useState<RoomTitleLinkDetailsDto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiClient.get(`/rooms/${roomId}/titles/${roomTitleId}/links`)
        .then(({ data }) => setLinks(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, roomId, roomTitleId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Title Links" maxWidth="max-w-md">
      <div className="p-4 custom-scrollbar max-h-[60vh] overflow-y-auto">
        {loading ? <p>Loading...</p> : (
          <div className="space-y-3">
            {links.map((link) => (
              <div key={link.id} className="p-3 bg-muted rounded-lg flex justify-between">
                <span>{link.title.titleName}</span>
                <span className="text-xs text-muted-foreground">{new Date(link.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};