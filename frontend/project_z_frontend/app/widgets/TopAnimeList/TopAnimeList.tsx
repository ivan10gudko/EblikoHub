import { useQuery } from "@tanstack/react-query";
import CollapsibleSection from "../../shared/ui/Callapsible/ui/CollapsableSection";
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import { AnimeCard, AnimeCardSceleton, getTopAnimeList, type AnimeCardType } from "~/entities/title";

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
        renderItem={(anime) => <AnimeCard data={anime} />}
    />
};

export default TopAnimeList;
