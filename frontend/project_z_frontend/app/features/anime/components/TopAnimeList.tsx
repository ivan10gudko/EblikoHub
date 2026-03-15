import { useQuery } from "@tanstack/react-query";
import { getTopAnimeList } from "~/features/anime/services/jikan.api";
import AnimeCard, { type AnimeCardType } from "./AnimeCard";
import CollapsibleSection from "../../../components/UI/Callapsible/ColapsableSection";
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import AnimePageSceleton from "./AnimePageSceleton";

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
        renderSceletonItem={(key) => <AnimePageSceleton key={key} />}
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default TopAnimeList;
