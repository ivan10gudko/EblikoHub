import type { Anime } from "~/entities/title/model/animeTitle.types";
import Title from "../../entities/title/ui/Title";
import AnimeStat from "../../entities/title/ui/AnimeStat";
import Genres from "../../entities/title/ui/Genres";
import Description from "../../entities/title/ui/Synopsis";
import Synopsis from "../../entities/title/ui/Synopsis";
import Trailer from "../../entities/title/ui/Trailer";

//TODO можна додати компонент зі статистикою друзів( оцінки , хто дивився) пізніше
interface Props{
    data: Anime
}
const AnimeInfo : React.FC<Props> = ({data}) => {
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
export default AnimeInfo;