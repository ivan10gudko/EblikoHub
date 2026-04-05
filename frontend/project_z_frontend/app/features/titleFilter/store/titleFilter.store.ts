import { create } from 'zustand';
import { Status } from '~/entities/titleRecord';
import type { SortOrder } from '~/shared/types/api';


export type TitleSortType = 'rating' | 'title' | 'chapters' | 'createdAt';

interface TitleFilterState {
    search: string;
    sortBy: TitleSortType;
    order: SortOrder;
    status? : Status

    setSearch: (value: string) => void;
    setSort: (sortBy: TitleSortType) => void;
    toggleOrder: () => void;
    setStatus: (status: Status | undefined) => void;
    reset: () => void;
    setSortFromUrl: (val: string) => void;
    setStatusFromUrl:(val: string) => void
    setOrderFromUrl: (val: string) => void;
}

export const useTitleFilterStore = create<TitleFilterState>((set) => ({
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    status: undefined,

    setSearch: (search) => set({ search }),
    
    setSort: (sortBy) => set({ sortBy }),

    toggleOrder: () => set((state) => ({ 
        order: state.order === 'asc' ? 'desc' : 'asc' 
    })),

    setStatus: (status) => set({ 
        status: status
    }),

    reset: () => set({
        search: '',
        sortBy: 'rating',
        order: 'desc',
        status: undefined,
    }),
    setSortFromUrl: (val: string) => {
        const valid: TitleSortType[] = ['rating', 'title', 'chapters', 'createdAt'];
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
        if (val === 'asc' || val === 'desc') {
            set({ order: val });
        }
    },
}));