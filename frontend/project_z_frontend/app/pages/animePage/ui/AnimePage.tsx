import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import AnimePageSceleton from "~/pages/animePage/ui/AnimePageSkeleton";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import AnimeInfo from "~/widgets/AnimeInfo/AnimeInfo";
import AnimeSidebar from "~/widgets/AnimeSidebar/AnimeSidebar";
import { getAnimeById } from "~/entities/title/api/jikan.api";
import type { Anime } from "~/entities/title/model/animeTitle.types";

const AnimePage = ({id}:{id: number | undefined}) => {
    
    if (!id){
        return <ErrorAnimePage />
    }

    const { isPending, error, data } = useQuery<Anime>({
            queryKey: ["anime-page",id],
            queryFn: () => getAnimeById(id)
        });

    if (isPending) return <AnimePageSceleton />

    if (error){
        console.error(error.message)
        return <ErrorAnimePage />
    }

    return (
        <div className="sm:flex sm:gap-8 mx-auto my-8 w-[90%] max-w-[1200px] h-fit">
            <AnimeSidebar data={data} />
            <AnimeInfo data={data} />
        </div>
    )
}

export default AnimePage;