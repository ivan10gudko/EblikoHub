import { useQuery } from "@tanstack/react-query";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import { AnimeCardSceleton, getTopAnimeList, type AnimeCardType } from "~/entities/title";

import { CollapsableSection } from "~/shared/ui/Callapsible";

import { ManagedAnimeCard } from "~/features/manageTitle";

const TopAnimeList = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["top_anime_list"],
    queryFn: getTopAnimeList,
  });

  return (
    <CollapsableSection<AnimeCardType, number>
      title={
        <>
          <LocalFireDepartmentRoundedIcon /> Top Rated
        </>
      }
      items={data ?? []}
      isPending={isPending}
      error={error}
      getItemKey={(anime) => anime.id}
      renderSceletonItem={(key) => <AnimeCardSceleton key={key} />}
      renderItem={(anime) => <ManagedAnimeCard key={anime.id} anime={anime} />}
    />
  );
};

export default TopAnimeList;
