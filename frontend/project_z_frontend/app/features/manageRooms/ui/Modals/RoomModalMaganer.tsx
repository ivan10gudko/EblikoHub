import { useCallback } from "react";
import { useSearchParams } from "react-router";

import { AddRoomModal } from "~/features/manageRooms";
import type { ModalType } from "~/shared/types";


export const RoomModalManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalType = searchParams.get('modal') as ModalType | null;
  const isAddOpen = modalType === 'add';

  const rawStep = parseInt(searchParams.get('step') || '1', 10);
  const step = Math.min(Math.max(rawStep || 1, 1), 2);

  const handleClose = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('modal');
      next.delete('step');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setStep = useCallback((newStep: number) => {
    if (!isAddOpen) return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('step', String(newStep));
      return next;
    }, { replace: true });
  }, [isAddOpen, setSearchParams]);

  return (
    <AddRoomModal
      isOpen={isAddOpen}
      onClose={handleClose}
      step={step}
      onStepChange={setStep}
    />
  );
};
