import React from "react";

import { RoomRole } from "~/entities/room";

import { useRoomModal } from "~/features/manageRoomSettings/hooks/useRoomModal";
import { useRoomMemberByRoomIdAndUserId } from "~/features/manageRoomMembers";
import {
  useRoomTitleDetails,
  AddRoomTitleModal,
  EditRoomTitleModal,
  ViewAllRoomTitleLinksModal,
  useCachedRoomTitle,
} from "~/features/manageRoomTitles";
import { useAuthStore } from "~/features/auth";

export const RoomModalManager = ({ roomId }: { roomId: number }) => {
  const {
    isAddRoomTitleOpen,
    activeSettingsModal,
    settingsEntityId,
    closeAllModals,
  } = useRoomModal();

  const userId = useAuthStore((state) => state.userId);

  const { data: currentMember } = useRoomMemberByRoomIdAndUserId(userId ?? null, roomId);

  const canDeleteLinks =
    currentMember?.role === RoomRole.OWNER || currentMember?.role === RoomRole.ADMIN;

  const cachedTitle = useCachedRoomTitle(
    roomId,
    activeSettingsModal === "edit-title" ? settingsEntityId : null
  );

  const { data: fetchedTitle } = useRoomTitleDetails(
    roomId,
    !cachedTitle && activeSettingsModal === "edit-title" ? settingsEntityId : null
  );

  const editingTitle = cachedTitle ?? fetchedTitle;

  const modals: { key: string; isOpen: boolean; render: () => React.ReactNode }[] = [
    {
      key: "add-room-title",
      isOpen: isAddRoomTitleOpen,
      render: () => (
        <AddRoomTitleModal isOpen onClose={closeAllModals} roomId={roomId} />
      ),
    },
    {
      key: "edit-title",
      isOpen: activeSettingsModal === "edit-title" && !!editingTitle,
      render: () => (
        <EditRoomTitleModal isOpen onClose={closeAllModals} roomId={roomId} item={editingTitle!} />
      ),
    },
    {
      key: "all-links",
      isOpen: activeSettingsModal === "all-links",
      render: () => (
        <ViewAllRoomTitleLinksModal
          isOpen
          onClose={closeAllModals}
          roomId={roomId}
          roomTitleId={settingsEntityId ?? ""}
          canDelete={canDeleteLinks}
        />
      ),
    },
  ];
  return modals
    .filter((m) => m.isOpen)
    .map((m) => <React.Fragment key={m.key}>{m.render()}</React.Fragment>);
};