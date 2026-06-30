import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { useParams } from "react-router";
import { AnimePageSceleton, getAnimeById, type Anime } from "~/entities/title";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { AnimeInfo } from "~/widgets/AnimeInfo";
import { AnimeSidebar, AnimeSidebarSkeleton } from "~/widgets/AnimeSidebar";

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
        <div className="sm:flex sm:gap-8 mx-auto my-8 w-[90%]  h-fit">
            <Suspense fallback={<AnimeSidebarSkeleton/>}>
                <AnimeSidebar data={data} />
            </Suspense>
            <AnimeInfo data={data} />
        </div>
    )
}

export default AnimePage;