import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useTitleFilterStore } from "../store/titleFilter.store";
import { titleRecordService, type TitleParams } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";


export const useTitlesQuery = () => {

    const params = useTitleFilterStore();
    const {userId} = useAuthStore();
    return useInfinityTitles(
        userId,params
    );
    
};