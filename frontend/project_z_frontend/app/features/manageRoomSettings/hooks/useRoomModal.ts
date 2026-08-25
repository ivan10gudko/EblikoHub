import { useSearchParams } from "react-router";
import type { ModalType } from "~/shared/types";

export type SettingsModalType = 
  | 'user-links' 
  | 'all-links' 
  | 'members' 
  | 'edit-title' 
  | 'add-room-title' 
  | 'ai-sync';

export const useRoomModal = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const modalType = searchParams.get('modal') as ModalType | null;
  const activeSettingsModal = searchParams.get('settings') as SettingsModalType | null;
  const settingsEntityId = searchParams.get('entityId');

  const rawStep = parseInt(searchParams.get('step') || '1', 10);
  const step = Math.min(Math.max(Number.isNaN(rawStep) ? 1 : rawStep, 1), 2);

  const isAddOpen = modalType === 'add';
  const isAddRoomTitleOpen = activeSettingsModal === 'add-room-title';

  const openRoomModal = (type: ModalType, initialStep = '1') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('modal', type);
      next.set('step', initialStep);
      next.delete('settings');
      next.delete('entityId');
      return next;
    }, { replace: true });
  };

  const openSettingsModal = (type: SettingsModalType, entityId?: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('settings', type);
      if (entityId) {
        next.set('entityId', entityId);
      } else {
        next.delete('entityId');
      }
      next.delete('modal');
      next.delete('step');
      return next;
    }, { replace: true });
  };

  const isSettingsModalOpen = (type: SettingsModalType, entityId?: string) => {
    if (activeSettingsModal !== type) return false;
    return entityId === undefined || settingsEntityId === entityId;
  };

  const closeAllModals = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('modal');
      next.delete('step');
      next.delete('settings');
      next.delete('entityId');
      return next;
    }, { replace: true });
  };

  const setRoomStep = (newStep: number) => {
    if (modalType !== 'add') return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('step', String(newStep));
      return next;
    }, { replace: true });
  };

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