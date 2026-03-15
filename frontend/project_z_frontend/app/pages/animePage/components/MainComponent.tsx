import type { Anime } from "~/features/anime/types/MyAnimeList.types";
import Title from "../../../features/anime/components/Title";
import AnimeStat from "../../../features/anime/components/AnimeStat";
import Genres from "../../../features/anime/components/Genres";
import Description from "../../../features/anime/components/Synopsis";
import Synopsis from "../../../features/anime/components/Synopsis";
import Trailer from "../../../features/anime/components/Trailer";

//TODO можна додати компонент зі статистикою друзів( оцінки , хто дивився) пізніше
interface Props{
    data: Anime
}
const MainComponent : React.FC<Props> = ({data}) => {
    return (
    <div className="w-full font-light">
        <Title originalTitle={data.title ?? ""}>{data.title_english ?? data.title }</Title>
        <AnimeStat
            year={data?.year}
            studio={data.studios[0]?.name}
            duration={data.episodes && data.episodes !== 1 ? `${data.episodes} ep, ${data.duration?.replace("per ep","")} ` : data.duration}
            rating={data.score}
            scored_by={data.scored_by}
            />
        <Genres genres={[...data.genres,...data.themes]} />
        <Synopsis synopsis={data.synopsis}/>
        <Trailer url={data.trailer.embed_url} />
    </div> );
}
export default MainComponent;