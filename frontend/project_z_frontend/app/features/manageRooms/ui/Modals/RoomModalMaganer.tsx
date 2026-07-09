import { useCachedRoomTitle } from "../../helpers/roomModalRegistry";
import { useRoomModal } from "../../hooks/useRoomModal";
import { useRoomTitleDetails } from "../../hooks/useRoomTitleDetails";
import { AddRoomModal } from "./AddRoomModal";
import { AddRoomTitleModal } from "./AddRoomTitleModal";
import { EditRoomTitleModal } from "./EditRoomTitleModal";
import { RoomTitleUserLinksModal } from "./RoomTitleUserLinksModal";
import { ViewAllRoomTitleLinksModal } from "./ViewAllRoomTitleLinksModal";

export const RoomModalManager = ({ roomId }: { roomId: number }) => {
  const {
    isAddRoomTitleOpen,
    activeSettingsModal, settingsEntityId,
    closeAllModals,
  } = useRoomModal();

  const cachedTitle = useCachedRoomTitle(
    roomId,
    activeSettingsModal === 'edit-title' ? settingsEntityId : null
  );

  const { data: fetchedTitle } = useRoomTitleDetails(
    roomId,
    !cachedTitle && activeSettingsModal === 'edit-title' ? settingsEntityId : null
  );

  const editingTitle = cachedTitle ?? fetchedTitle;

  const modals: { key: string; isOpen: boolean; render: () => React.ReactNode }[] = [
    {
      key: "add-room-title",
      isOpen: isAddRoomTitleOpen,
      render: () => <AddRoomTitleModal isOpen onClose={closeAllModals} onSuccess={closeAllModals} roomId={roomId} />,
    },
    {
      key: "edit-title",
      isOpen: activeSettingsModal === "edit-title" && !!editingTitle,
      render: () => <EditRoomTitleModal isOpen onClose={closeAllModals} roomId={roomId} item={editingTitle!} />,
    },
    {
      key: "user-links",
      isOpen: activeSettingsModal === "user-links",
      render: () => <RoomTitleUserLinksModal isOpen onClose={closeAllModals} roomTitleId={settingsEntityId ?? ""} />,
    },
    {
      key: "all-links",
      isOpen: activeSettingsModal === "all-links",
      render: () => <ViewAllRoomTitleLinksModal isOpen onClose={closeAllModals} roomId={roomId} roomTitleId={settingsEntityId ?? ""} />,
    },
  ];

  return <>{modals.filter(m => m.isOpen).map(m => <div key={m.key}>{m.render()}</div>)}</>;
};