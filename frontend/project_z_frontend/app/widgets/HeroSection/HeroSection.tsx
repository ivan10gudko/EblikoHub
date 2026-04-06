import { useSuspenseQuery } from "@tanstack/react-query";

import HeroDescription from "./HeroDescription";
import { Link} from "react-router";
import { getTopAnime, type Anime } from "~/entities/title";
import { Badge } from "~/shared/ui/Badge";
import { Rating } from "~/shared/ui/Rating";
import { Button } from "~/shared/ui/Button";
import { Date } from "~/shared/ui/Date";

const HeroSection: React.FC<{}> = () => {
    const { error, data } = useSuspenseQuery<Anime>({
        queryKey: ["hero_section", "top_anime"],
        queryFn: async ()=>{
            const res = await getTopAnime();
            console.log(res);
            return res;
        },
    });

    if (!data || error) return <span>No anime data found.</span>;;

return (
    <div className="w-full relative min-h-[500px] md:min-h-[88vh] flex items-center bg-black overflow-hidden"> 
        
        <div className="absolute inset-0 z-0">
            <img
                loading="lazy"
                className="w-full h-full object-cover opacity-60 md:opacity-100"
                src={data.trailer?.images.maximum_image_url ?? "/placeholder.jpg"}
                alt={data.title_english ?? 'featured-anime'}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent md:bg-gradient-to-r md:from-black md:via-black/70 md:to-transparent" />
        </div>

        <div className="relative z-10 w-full py-12 md:py-20 px-6 md:px-12 lg:px-24  text-gray-200 ">
            <div className="max-w-full md:max-w-2xl xl:max-w-3xl">
                <Badge size="sm" color="blue" textColor="white" border={false}>Featured anime</Badge>
                
                <h2 className="mt-4 mb-2 text-2xl sm:text-3xl md:text-5xl font-bold leading-tight">
                    {data.title_english}
                </h2>

                <div className="flex gap-4 items-center mb-6">
                    <Rating>{data.score}</Rating>
                    <Date>{data.year ?? data.aired.prop.from.year}</Date>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {data.genres.map((genre) => (
                        <Badge key={genre.mal_id}>{genre.name}</Badge>
                    ))}
                </div>

                {data.synopsis && (
                    <div className="mb-8 text-gray-200 text-sm md:text-base line-clamp-4 md:line-clamp-none">
                        <HeroDescription id={data.mal_id}>
                            {data.synopsis}
                        </HeroDescription>
                    </div>
                )}
                
                <div className="flex flex-wrap gap-4 mt-auto">
                    {data.trailer.embed_url && (
                        <Button variant="outline" className="flex-1 sm:flex-none text-white border-white">
                            <a href={data.trailer.embed_url} target="_blank" rel="noreferrer">Watch Trailer</a>
                        </Button>
                    )}
                    <Button className="bg-amber-300 text-black flex-1 sm:flex-none">
                        <Link to={`/anime/${data.mal_id}`}>Learn more</Link>
                    </Button>
                </div>
            </div>
        </div>
    </div>
);
};

export default HeroSection;
