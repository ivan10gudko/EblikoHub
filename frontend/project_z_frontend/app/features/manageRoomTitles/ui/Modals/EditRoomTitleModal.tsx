import Modal from "~/shared/ui/Modal/Modal";
import { notify } from "~/shared/lib";
import { TitleType } from "~/entities/titleRecord";
import type { RoomTitleDetails } from "~/features/manageRoomTitles/model/roomTitle.types";
import { useRoomTitleActions } from "~/features/manageRoomTitles";
import { RoomTitleForm, type RoomTitleFormData } from "./RoomTitleForm";

interface EditRoomTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  item: RoomTitleDetails;
}

export const EditRoomTitleModal = ({
  isOpen,
  onClose,
  roomId,
  item,
}: EditRoomTitleModalProps) => {
  const { updateTitle, isPending } = useRoomTitleActions(roomId);

  const handleSubmit = (formData: RoomTitleFormData) => {
    updateTitle({
      titleId: item.id,
      data: {
        titleName: formData.titleName,
        titleType: formData.titleType,
        apiTitleId: formData.apiTitleId ? Number(formData.apiTitleId) : undefined,
        imageUrl: formData.imageUrl ?? undefined,
      },
    });
    notify.success("Title updated!");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Room Title" maxWidth="max-w-2xl">
      <RoomTitleForm
        key={item.id}
        initialValues={{
          titleName: item.titleName,
          imageUrl: item.imageUrl || null,
          titleType: item.titleType ?? TitleType.ANIME,
          apiTitleId: item.apiTitleId ?? undefined,
        }}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isPending={isPending}
        submitText="Save Changes"
      />
    </Modal>
  );
};