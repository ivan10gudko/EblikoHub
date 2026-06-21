import { create } from 'zustand';

type ModalState = {
  activeRoomId: number | null;
  type: 'edit' | 'delete' | 'add' | null;
  step: number;
  open: (type: 'edit' | 'delete' | 'add', roomId?: number) => void;
  setStep: (step: number) => void;
  close: () => void;
};

export const useRoomModalStore = create<ModalState>((set) => ({
  activeRoomId: null,
  type: null,
  step: 1, 
  open: (type, roomId) => set({ type, activeRoomId: roomId, step: 1 }),
  setStep: (step) => set({ step }),
  close: () => set({ type: null, activeRoomId: null, step: 1 }),
}));