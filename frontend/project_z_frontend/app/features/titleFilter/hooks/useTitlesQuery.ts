
import { useTitleFilterStore } from "../store/titleFilter.store";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";


export const useTitlesQuery = (userId: string | null) => {
    const { search, sortBy, order, status } = useTitleFilterStore();
    return useInfinityTitles(userId, { search, sortBy, order, status });
};