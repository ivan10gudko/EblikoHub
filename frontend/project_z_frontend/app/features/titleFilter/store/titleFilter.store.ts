import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TitleType } from '~/entities/titleRecord';
import { Status } from '~/shared/types';
import type { SortOrder } from '~/shared/types/api';

export type TitleSortType = 'rating' | 'title' | 'chapters' | 'createdAt' | 'customOrder';

interface TitleFilterState {
    search: string;
    sortBy: TitleSortType;
    order: SortOrder;
    status?: Status;
    types: TitleType[];

    setSearch: (value: string) => void;
    setSort: (sortBy: TitleSortType) => void;
    toggleOrder: () => void;
    setStatus: (status: Status | undefined) => void;
    toggleType: (type: TitleType) => void;
    reset: () => void;
    setSortFromUrl: (val: string) => void;
    setStatusFromUrl: (val: string) => void;
    setOrderFromUrl: (val: string) => void;
    setTypesFromUrl: (val: string) => void;
}

export const useTitleFilterStore = create<TitleFilterState>()(
    persist(
        (set) => ({
            search: '',
            sortBy: 'createdAt',
            order: 'desc',
            status: undefined,
            types: [],

            setSearch: (search) => set({ search }),
            setSort: (sortBy) => set({ sortBy }),
            toggleOrder: () => set((state) => ({
                order: state.order === 'asc' ? 'desc' : 'asc'
            })),
            setStatus: (status) => set({ status }),
            toggleType: (type: TitleType) => set((state) => ({
                types: state.types.includes(type)
                    ? state.types.filter((t) => t !== type)
                    : [...state.types, type]
            })),
            reset: () => set({
                search: '',
                sortBy: 'createdAt',
                order: 'desc',
                status: undefined,
                types: [],
            }),
            setSortFromUrl: (val: string) => {
                const valid: TitleSortType[] = ['rating', 'title', 'chapters', 'createdAt', 'customOrder'];
                if (valid.includes(val as TitleSortType)) set({ sortBy: val as TitleSortType });
            },
            setStatusFromUrl: (val: string) => {
                const validStatuses = Object.values(Status) as string[];
                if (validStatuses.includes(val)) {
                    set({ status: val as Status });
                } else if (val === 'undefined') {
                    set({ status: undefined });
                }
            },
            setOrderFromUrl: (val: string) => {
                if (val === 'asc' || val === 'desc') set({ order: val });
            },
            setTypesFromUrl: (val: string) => {
                if (!val || val === 'undefined') {
                    set({ types: [] });
                    return;
                }
                const validTypes = Object.values(TitleType) as string[];
                const parsedTypes = val.split(',').filter((t) => validTypes.includes(t)) as TitleType[];
                set({ types: parsedTypes });
            },
        }),
        {
            name: 'watchlist-filters-storage', 
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                search: state.search,
                sortBy: state.sortBy,
                order: state.order,
                status: state.status,
                types: state.types,
            }),
        }
    )
);