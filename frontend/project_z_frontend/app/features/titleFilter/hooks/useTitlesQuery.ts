
import { useTitleFilterStore } from "../store/titleFilter.store";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";


export const useTitlesQuery = (userId : string | null) => {

    const { search, sortBy, order, status } = useTitleFilterStore();
    const params = { search, sortBy, order, status };
    return useInfinityTitles(
        userId,params
    );
    
};