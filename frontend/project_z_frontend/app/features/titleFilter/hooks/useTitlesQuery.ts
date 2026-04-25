
import { useMemo } from "react";
import { useTitleFilterStore } from "../store/titleFilter.store";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";


export const useTitlesQuery = (userId: string | null) => {

    const { search, sortBy, order, status } = useTitleFilterStore();
    const params = useMemo(() => ({
        search, sortBy, order, status
    }), [search, sortBy, order, status]);
    return useInfinityTitles(
        userId, params
    );

};