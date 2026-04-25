import { useQuery } from "@tanstack/react-query";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import {
    AnimeCardSceleton,
    getSeasonalAnimeList,
    type AnimeCardType,
} from "~/entities/title";

import CollapsibleSection from "~/shared/ui/Callapsible/ui/CollapsableSection";
import {
    ManagedAnimeCard,
} from "~/features/manageTitle";

const SeasonAnimeList: React.FC<{}> = ({}) => {
    const { data, isPending, error } = useQuery({
        queryKey: ["seasonal_anime"],
        queryFn: getSeasonalAnimeList,
    });

    return (
        <CollapsibleSection<AnimeCardType, number>
            title={
                <>
                    <TrendingUpRoundedIcon /> Popular right now
                </>
            }
            items={data ?? []}
            error={error}
            isPending={isPending}
            getItemKey={(anime) => anime.id}
            renderSceletonItem={(key) => <AnimeCardSceleton key={key} />}
            renderItem={(anime) => <ManagedAnimeCard key={anime.id} anime={anime} />}
        />
    );
};

export default SeasonAnimeList;
