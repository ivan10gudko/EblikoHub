
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SortOrder } from '~/shared/types/api';

export type RoomSortType = 'roomName' | 'createdAt' | 'membersCount';

interface RoomFilterState {
    search: string;
    sortBy: RoomSortType;
    order: SortOrder;

    setSearch: (value: string) => void;
    setSort: (sortBy: RoomSortType) => void;
    toggleOrder: () => void;
    reset: () => void;


    setSortFromUrl: (val: string) => void;
    setOrderFromUrl: (val: string) => void;
}

export const useRoomFilterStore = create<RoomFilterState>()(
    persist(
        (set) => ({
            search: '',
            sortBy: 'createdAt',
            order: 'desc',

            setSearch: (search) => set({ search }),
            setSort: (sortBy) => set({ sortBy }),
            toggleOrder: () => set((state) => ({
                order: state.order === 'asc' ? 'desc' : 'asc'
            })),
            reset: () => set({
                search: '',
                sortBy: 'createdAt',
                order: 'desc',
            }),

            setSortFromUrl: (val: string) => {
                const valid: RoomSortType[] = ['roomName', 'createdAt', 'membersCount'];
                if (valid.includes(val as RoomSortType)) {
                    set({ sortBy: val as RoomSortType });
                }
            },
            setOrderFromUrl: (val: string) => {
                if (val === 'asc' || val === 'desc') {
                    set({ order: val });
                }
            },
        }),
        {
            name: 'room-filters-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                search: state.search,
                sortBy: state.sortBy,
                order: state.order,
            }),
        }
    )
);