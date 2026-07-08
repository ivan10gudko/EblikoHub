import { useCallback } from "react";
import { useSearchParams } from "react-router";
import type { ModalType } from "~/shared/types";

export type SettingsModalType = 'user-links' | 'all-links' | 'members' | 'edit-title' | 'add-room-title';

export const useRoomModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalType = searchParams.get('modal') as ModalType | null;
  const rawStep = parseInt(searchParams.get('step') || '1', 10);
  const step = Math.min(Math.max(rawStep || 1, 1), 2);
  const isAddOpen = modalType === 'add';


  const openRoomModal = useCallback((type: ModalType, initialStep = '1') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('modal', type);
      next.set('step', initialStep);
      next.delete('settings');
      next.delete('entityId');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const activeSettingsModal = searchParams.get('settings') as SettingsModalType | null;
  const settingsEntityId = searchParams.get('entityId');
  const isAddRoomTitleOpen = activeSettingsModal === 'add-room-title';
  const openSettingsModal = useCallback((type: SettingsModalType, entityId?: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('settings', type);
      next.delete('modal');
      next.delete('step');

      if (entityId !== undefined) {
        next.set('entityId', entityId);
      } else {
        next.delete('entityId');
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const isSettingsModalOpen = useCallback((type: SettingsModalType, entityId?: string) => {
    if (activeSettingsModal !== type) return false;
    if (entityId === undefined) return true;
    return settingsEntityId === entityId;
  }, [activeSettingsModal, settingsEntityId]);

  const closeAllModals = useCallback(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('modal');
      next.delete('step');
      next.delete('settings');
      next.delete('entityId');
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const setRoomStep = useCallback((newStep: number) => {
    if (modalType !== 'add') return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('step', String(newStep));
      return next;
    }, { replace: true });
  }, [modalType, setSearchParams]);

  return {
    modalType,
    isAddOpen,
    isAddRoomTitleOpen,
    step,
    activeSettingsModal,
    settingsEntityId,
    isSettingsModalOpen,
    openRoomModal,
    openSettingsModal,
    closeAllModals,
    setRoomStep,
  };
};