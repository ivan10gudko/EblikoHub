import { useQuery } from "@tanstack/react-query";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { AnimeCard, AnimeCardSceleton, getSeasonalAnimeList, type AnimeCardType } from "~/entities/title";
import CollapsibleSection from "~/shared/ui/Callapsible/ui/CollapsableSection";

import { AddToWatchedCardAction, AddToWatchlistCardAction } from "~/features/watchlist";
import { RateCardAction } from "~/features/rating";

const SeasonAnimeList: React.FC<{}> = ({})=>{

    const { data, isPending, error } = useQuery({
        queryKey:["seasonal_anime"],
        queryFn: getSeasonalAnimeList
    })

    return <CollapsibleSection<AnimeCardType, number>
        title={<><TrendingUpRoundedIcon /> Popular right now</>}
        items={data ?? []}
        error={error}
        isPending={isPending}
        getItemKey={(anime) => anime.id}
        renderSceletonItem={(key) => <AnimeCardSceleton key={key} />}
        renderItem={(anime) =>( 
                <AnimeCard
                    key={anime.id}
                    data={anime}
                    
                    menuActions={
                        <>
                            <AddToWatchedCardAction item={anime} />
                            <AddToWatchlistCardAction item={anime} />
                            <RateCardAction item={anime} />
                        </>
                    }
                />
            )}
    />
};

export default SeasonAnimeList;
