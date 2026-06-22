import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { ModalType } from "~/shared/types";

export const useRoomModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalType = searchParams.get('modal') as ModalType | null;
  const rawStep = parseInt(searchParams.get('step') || '1', 10);
  const step = Math.min(Math.max(rawStep || 1, 1), 2);
  const isAddOpen = modalType === 'add';

  const open = useCallback((type: ModalType, initialStep = '1') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('modal', type);
      next.set('step', initialStep);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const close = useCallback(() => {
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

  return {
    modalType,
    isAddOpen,
    step,
    open,
    close,
    setStep
  };
};