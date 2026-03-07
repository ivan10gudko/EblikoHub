import { useSuspenseQuery } from "@tanstack/react-query";
import { getTopAnime } from "~/services/jikanApi";
import Badge from "../Badge";
import Rating from "../Rating";
import Date from "../Date";
import HeroDescription from "./HeroDescription";
import { Link, Navigate } from "react-router";
import Button from "../Button";
import type { Anime } from "~/types/MyAnimeList.types";

const HeroSection: React.FC<{}> = () => {
    const { isPending, error, data } = useSuspenseQuery<Anime>({
        queryKey: ["hero_section", "top_anime"],
        queryFn: async ()=>{
            const res = await getTopAnime();
            console.log(res);
            return res;
        },
    });

    if (!data || error) return <span>No anime data found.</span>;;

return (
    <div className="w-full flex h-[88vh] flex-row-reverse relative">
        <img
            loading="lazy"
            src={data.trailer?.images?.maximum_image_url ?? "/placeholder.jpg"}
            alt={`Top Rated Anime: ${data.title_english}`}
        />
        <div className="bg-black w-full"></div>
        <div className="absolute w-full h-full bg-linear-95 from-black/100 via-black/90 to-black/40 text-white py-8 lg:py-24 px-2 md:px-8 lg:px-20">
            <div className="w-full md:w-2/3 xl:w-1/2 max-md:bg-linear-180 from-black/0 via-black/85 to-black/100 md:bg-transparent max-md:py-4 max-md:px-4">
                <Badge size="sm" color="blue" border={false}>
                    Featured anime
                </Badge>
                <h2 className="my-3 text-2xl sm:text-3xl md:text-4xl">
                    {data.title_english}
                </h2>
                <div className="flex gap-4">
                    <Rating>{data.score}</Rating>
                    <Date>{data.year}</Date>
                </div>
                <div className="flex gap-4 my-4">
                    {data.genres.map(
                        (genre: { mal_id: number; name: string; [index: string]: any }) => (
                            <Badge key={genre.mal_id}>{genre.name}</Badge>
                            )
                    )}
                </div>
                {data.synopsis ? <HeroDescription id={data.mal_id}>
                    {data.synopsis}
                </HeroDescription> : null }
                
                <div className="flex gap-8 my-4">
                    {data.trailer.embed_url ? <Button color="white"><a href={data.trailer.embed_url}>Watch Trailer</a></Button>:null}
                    <Button className="bg-amber-400 "><Link to={`/anime/${data.mal_id}`}>Learn more</Link></Button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default HeroSection;
