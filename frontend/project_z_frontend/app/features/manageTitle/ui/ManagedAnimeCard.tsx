import { AnimeCard, type AnimeCardType } from "~/entities/title";
import { useTitleByApiId, Status } from "~/entities/titleRecord";
import RateCardAction from "./RateCardAction";
import StatusSelect from "./StatusSelect";

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