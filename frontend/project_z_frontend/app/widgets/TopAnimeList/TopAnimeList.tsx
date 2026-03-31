import { useQuery } from "@tanstack/react-query";
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { AnimeCard, AnimeCardSceleton, getTopAnimeList, type AnimeCardType } from "~/entities/title";
import CollapsibleSection from "~/shared/ui/Callapsible/ui/CollapsableSection";
import { AddToWatchedCardAction, AddToWatchlistCardAction, ManagedAnimeCard, RateCardAction } from "~/features/manageTitle";

const TopAnimeList: React.FC<{}> = ({})=>{
    
    const { data, isPending, error } = useQuery({
        queryKey:["top_anime_list"],
        queryFn: getTopAnimeList
    })

    return <CollapsibleSection<AnimeCardType, number>
        title={<><LocalFireDepartmentRoundedIcon /> Top Rated</>}
        items={data ?? []}
        isPending={isPending}
        error={error}
        getItemKey={(anime) => anime.id}
        renderSceletonItem={(key) => <AnimeCardSceleton key={key} />}
        renderItem={(anime) => <ManagedAnimeCard key={anime.id} anime={anime} />}
    />
};

export default TopAnimeList;
