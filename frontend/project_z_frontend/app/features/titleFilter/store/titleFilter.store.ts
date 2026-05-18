import { create } from 'zustand';
import { TitleType } from '~/entities/titleRecord';
import { getInitialValue } from '~/shared/helpers';
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
    setStatusFromUrl: (val: string) => void
    setOrderFromUrl: (val: string) => void;
    setTypesFromUrl: (val: string) => void;
}

export const useTitleFilterStore = create<TitleFilterState>((set) => ({
    search: getInitialValue('search', ''),
    sortBy: getInitialValue<TitleSortType>('sortBy', 'createdAt'),
    order: getInitialValue<SortOrder>('order', 'desc'),
    status: getInitialValue<Status | undefined>('status', undefined),
    types: (() => {
        const urlVal = getInitialValue<string>('types', '');
        return urlVal ? (urlVal.split(',') as TitleType[]) : [];
    })(),
    setSearch: (search) => set({ search }),

    setSort: (sortBy) => set({ sortBy }),

    toggleOrder: () => set((state) => ({
        order: state.order === 'asc' ? 'desc' : 'asc'
    })),

    setStatus: (status) => set({
        status: status
    }),
    toggleType: (type: TitleType) => set((state) => ({
        types: state.types.includes(type)
            ? state.types.filter((t) => t !== type)
            : [...state.types, type]
    })),
    reset: () => set({
        search: '',
        sortBy: 'rating',
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
        if (val === 'asc' || val === 'desc') {
            set({ order: val });
        }
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
}));