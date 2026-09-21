import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RoomWatchlistVisualState {
    showMyVisual: boolean;
    toggleVisual: () => void;
    setShowMyVisual: (show: boolean) => void;
}

export const useRoomWatchlistVisualStore = create<RoomWatchlistVisualState>()(
    persist(
        (set) => ({
            showMyVisual: false,
            toggleVisual: () => set((state) => ({ showMyVisual: !state.showMyVisual })),
            setShowMyVisual: (showMyVisual) => set({ showMyVisual }),
        }),
        {
            name: 'room-watchlist-visual-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);