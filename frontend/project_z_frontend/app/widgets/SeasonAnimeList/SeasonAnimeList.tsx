import { useQuery } from "@tanstack/react-query";
import CollapsibleSection from "../../shared/ui/Callapsible/ui/CollapsableSection";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { AnimeCard, AnimeCardSceleton, getSeasonalAnimeList, type AnimeCardType } from "~/entities/title";

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
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default SeasonAnimeList;
