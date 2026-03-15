import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import AnimePageSceleton from "~/features/anime/components/AnimePageSceleton";
import ErrorAnimePage from "~/pages/animePage/components/ErrorAnimePage";
import MainComponent from "~/pages/animePage/components/MainComponent";
import Sidebar from "~/pages/animePage/components/Sidebar";
import { getAnimeById } from "~/features/anime/services/jikan.api";
import type { Anime } from "~/features/anime/types/MyAnimeList.types";

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
            <Sidebar data={data} />
            <MainComponent data={data} />
        </div>
    )
}

export default AnimePage;