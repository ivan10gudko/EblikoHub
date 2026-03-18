import { useNavigate} from "react-router";
import { useRef} from "react";
import type { AnimeCardType } from "../model/animeTitle.types";
import { AnimeCardMenu } from "~/features/rating";//це виправлю після рефакторингу
import CardDate from "./CardDate";
import { Badge } from "~/shared/ui/Badge";
import { Rating } from "~/shared/ui/Rating";

interface Props{
    data:AnimeCardType;
}



const AnimeCard : React.FC<Props> = ({data})=>{
    const navigate = useNavigate();
    const ref = useRef<HTMLDivElement>(null);

    const genres = data.genres.length <= 3 ? data.genres : [...data.genres.slice(0,3) , {mal_id:0,type:"",name:`+${data.genres.length-3}`,url:""}]

    return (
    <div
        ref={ref}
        className="rounded-lg shadow hover:shadow-md pb-2 flex flex-col cursor-pointer h-full"
        onClick={()=>navigate(`/anime/${data.id}`)}
        >
        <div className="w-full relative aspect-[3/4] overflow-hidden rounded-lg">
            <img className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" src={data.img}/>
            <AnimeCardMenu parentRef={ref as React.RefObject<HTMLDivElement>} item={{id:data.id,title:data.title,img:data.img}}/>
        </div>
        <div className="px-3 pb-6 pt-6 flex flex-col grow">
            <div>
                <span className="font-light grow">{data.title}</span>
                    {data.year ? <CardDate >{data.year}</CardDate> : null}
                <div className="flex flex-wrap gap-2 my-4">
                    {genres.map(genre=><Badge key={genre.mal_id} textColor="black" size="sm">{genre.name}</Badge>)}
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row justify-between mt-auto">
                <Rating className="gap-1 text-sm ">{data?.score}</Rating>
                {data.airing ? <Badge textColor="black" size="sm">Ongoing</Badge>:<Badge color="black" textColor="white" size="sm">Completed</Badge>}    
            </div>
        </div>
    </div>)
};

export default AnimeCard;