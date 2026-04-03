import { AnimeCard, type AnimeCardType } from "~/entities/title";
import { useTitleByApiId, Status } from "~/entities/titleRecord";
import AddToWatchedCardAction from "./AddToWatchedCardAction";
import AddToWatchlistCardAction from "./AddToWatchlistCardAction";
import RateCardAction from "./RateCardAction";

const ManagedAnimeCard = ({ anime }: { anime: AnimeCardType }) => {
    const { data: titleRecord } = useTitleByApiId(anime.id);

    const initialData = {
        apiTitleId: anime.id,
        titleName: anime.title,
        status: Status.WATCHED,
    };

    return (
        <AnimeCard
            data={anime}
            menuActions={
                <>
                    <AddToWatchedCardAction initialData={initialData} titleRecord={titleRecord} />
                    <AddToWatchlistCardAction initialData={initialData} titleRecord={titleRecord} />
                    <RateCardAction initialData={initialData} titleRecord={titleRecord} />
                </>
            }
        />
    );
};

export default ManagedAnimeCard;