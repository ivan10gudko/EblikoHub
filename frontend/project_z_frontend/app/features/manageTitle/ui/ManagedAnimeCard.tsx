import { AnimeCard, type AnimeCardType } from "~/entities/title";
import {
  useTitleByApiId,
  StatusSelect,
  TitleType,
} from "~/entities/titleRecord";
import RateCardAction from "./RateCardAction";
import { Status } from "~/shared/types";

const ManagedAnimeCard = ({ anime }: { anime: AnimeCardType }) => {
  const { data: titleRecord } = useTitleByApiId(anime.id);

  const initialData = {
    apiTitleId: anime.id,
    titleName: anime.title,
    rating: titleRecord?.rating || undefined,
    status: titleRecord?.status ?? Status.DEFAULT,
    titleType: titleRecord?.titleType ?? TitleType.ANIME,
    imageUrl: titleRecord?.imageUrl || anime.img,
    pinned: titleRecord?.pinned || false,
  };

  return (
    <AnimeCard
      data={anime}
      menuActions={
        <>
          <StatusSelect
            initialData={initialData}
            titleRecord={titleRecord}
            variant="card"
          />
          <RateCardAction initialData={initialData} titleRecord={titleRecord} />
        </>
      }
    />
  );
};

export default ManagedAnimeCard;
