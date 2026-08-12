import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RoomDetailsSortVariants } from '~/entities/room';
import type { TitleType } from '~/entities/titleRecord';
import type { Status } from '~/shared/types';
import type { SortOrder } from '~/shared/types/api';

interface RoomFilterState {
    sortBy: RoomDetailsSortVariants;
    order: SortOrder;
    memberIds: string[];
    types: TitleType[];
    status?: Status;

    setSort: (sortBy: RoomDetailsSortVariants) => void;
    toggleOrder: () => void;
    toggleType: (type: TitleType) => void;
    toggleMember: (memberId: string) => void;
    setMembers: (memberIds: string[]) => void;
    setStatus: (status: Status | undefined) => void;
    reset: () => void;
}

export const useRoomDetailsFilterStore = create<RoomFilterState>()(
    persist(
        (set) => ({
            status: undefined,
            types: [],
            sortBy: RoomDetailsSortVariants.avgRating,
            order: 'desc',
            memberIds: [],

            setSort: (sortBy) => set({ sortBy }),
            toggleOrder: () => set((state) => ({
                order: state.order === 'asc' ? 'desc' : 'asc'
            })),
            toggleMember: (memberId) => set((state) => ({
                memberIds: state.memberIds.includes(memberId)
                    ? state.memberIds.filter((id) => id !== memberId)
                    : [...state.memberIds, memberId]
            })),
            setMembers: (memberIds) => set({ memberIds }),
            setStatus: (status) => set({ status }),
            toggleType: (type) => set((state) => ({
                types: state.types.includes(type)
                    ? state.types.filter((t) => t !== type)
                    : [...state.types, type]
            })),
            reset: () => set({
                types: [],
                status: undefined,
                sortBy: RoomDetailsSortVariants.avgRating,
                order: 'desc',
                memberIds: [],
            }),
        }),
        {
            name: 'room-details-filters-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sortBy: state.sortBy,
                order: state.order,
                memberIds: state.memberIds,
                types: state.types,
                status: state.status,
            }),
        }
    )
);