import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useRoomModalStore } from "~/entities/room";
import { AddRoomModal } from "~/features/manageRooms";
import { useSyncUrl } from "~/shared/hooks";
import type { ModalType } from "~/shared/types";

export const RoomModalManager = () => {
  const { type, step, open, setStep, close } = useRoomModalStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const isModalType = (value: string | null): value is ModalType => {
    return ['add', 'edit', 'delete'].includes(value as string);
  };

  useSyncUrl(
    { modal: type, step: step },
    {
      modal: (value: string) => {
        if (isModalType(value)) open(value);
      },
      step: (value: string) => {
        const parsedStep = parseInt(value, 10);
        if (!isNaN(parsedStep)) setStep(parsedStep);
      }
    }
  );

  useEffect(() => {
    const currentModal = searchParams.get('modal');
    const currentStep = searchParams.get('step');

    if (type) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('modal', type);
      nextParams.set('step', String(step));

      if (currentModal !== type || currentStep !== String(step)) {
        setSearchParams(nextParams, { replace: true });
      }
    } else if (currentModal) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('modal');
      nextParams.delete('step');
      setSearchParams(nextParams, { replace: true });
    }
  }, [type, step, searchParams, setSearchParams]);
  return (
    <AddRoomModal
      isOpen={type === 'add'}
      onClose={close}
    />
  );
};