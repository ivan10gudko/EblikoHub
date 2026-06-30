import { useQuery } from "@tanstack/react-query";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { AnimeCardSceleton, getSeasonalAnimeList, type AnimeCardType } from "~/entities/title";

import { ManagedAnimeCard } from "~/features/manageTitle";
import { CollapsableSection } from "~/shared/ui/Callapsible";

const SeasonAnimeList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["seasonal_anime"],
    queryFn: getSeasonalAnimeList,
  });

  return (
    <CollapsableSection<AnimeCardType, number>
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
