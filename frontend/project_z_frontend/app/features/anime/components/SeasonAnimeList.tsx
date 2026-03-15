import { useQuery } from "@tanstack/react-query";
import { getSeasonalAnimeList, getSeasonNow, getTopAnimeList } from "~/features/anime/services/jikan.api";
import AnimeCard, { type AnimeCardType } from "./AnimeCard";
import CollapsibleSection from "../../../components/UI/Callapsible/ColapsableSection";
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AnimePageSceleton from "./AnimePageSceleton";

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
        renderSceletonItem={(key) => <AnimePageSceleton key={key} />}
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default SeasonAnimeList;
