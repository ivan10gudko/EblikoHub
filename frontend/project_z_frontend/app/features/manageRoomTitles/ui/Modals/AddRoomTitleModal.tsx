import { useState } from "react";
import type { AnimeCardType } from "~/entities/title";
import { notify } from "~/shared/lib";
import { TitleSearch } from "../../../../widgets/TitleModal/components/titleSearch";
import { useRoomTitleActions } from "~/features/manageRoomTitles";
import { RoomTitleForm, type RoomTitleFormData } from "./RoomTitleForm";

interface AddRoomTitleScreenProps {
  onClose: () => void;
  roomId: number;
}

export const AddRoomTitleScreen = ({ onClose, roomId }: AddRoomTitleScreenProps) => {
  const { addTitle, isPending } = useRoomTitleActions(roomId);
  const [importedData, setImportedData] = useState<Partial<RoomTitleFormData> | undefined>();

  const handleImport = (anime: AnimeCardType) => {
    setImportedData({
      titleName: anime.title,
      apiTitleId: anime.id.toString(),
      imageUrl: anime.img,
    });
    notify.success("Title imported successfully!");
  };

  const handleSubmit = (formData: RoomTitleFormData) => {
    addTitle({
      titleName: formData.titleName,
      apiTitleId: Number(formData.apiTitleId || 0),
      titleType: formData.titleType,
      imageUrl: formData.imageUrl,
    });
    notify.success("Added to room!");
    setImportedData(undefined);
    onClose();
  };

  const handleClose = () => {
    setImportedData(undefined);
    onClose();
  };

  return (
    <RoomTitleForm
      initialValues={importedData}
      onSubmit={handleSubmit}
      onCancel={handleClose}
      isPending={isPending}
      submitText="Save Title"
      searchSlot={
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
            Quick Import via MAL
          </label>
          <TitleSearch onSelect={handleImport} />
        </div>
      }
    />
  );
};