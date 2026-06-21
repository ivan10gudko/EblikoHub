import { create } from 'zustand';

type ModalState = {
  activeRoomId: number | null;
  type: 'edit' | 'delete' | 'add' | null;
  open: (type: 'edit' | 'delete' | 'add', roomId?: number) => void;
  close: () => void;
};

export const useRoomModalStore = create<ModalState>((set) => ({
  activeRoomId: null,
  type: null,
  open: (type, roomId) => set({ type, activeRoomId: roomId }),
  close: () => set({ type: null, activeRoomId: null }),
}));