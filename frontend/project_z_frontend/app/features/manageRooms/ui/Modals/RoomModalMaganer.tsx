import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useRoomModalStore } from "~/entities/room";
import { AddRoomModal } from "~/features/manageRooms";
import { useSyncUrl } from "~/shared/hooks";
import type { ModalType } from "~/shared/types";

export const RoomModalManager = () => {
  const { type, open, close } = useRoomModalStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const isModalType = (value: string | null): value is ModalType => {
    return ['add', 'edit', 'delete'].includes(value as string);
  };

  useSyncUrl(
    { modal: type },
    {
      modal: (value: string) => {
        if (isModalType(value)) {
          open(value);
        }
      }
    }
  );

  useEffect(() => {
    const currentModal = searchParams.get('modal');

    if (type) {
      if (currentModal !== type) {
        setSearchParams({ modal: type }, { replace: true });
      }
    } else {
      if (currentModal) {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('modal');
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [type, searchParams, setSearchParams]);

  return (
    <AddRoomModal 
      isOpen={type === 'add'} 
      onClose={close} 
    />
  );
};