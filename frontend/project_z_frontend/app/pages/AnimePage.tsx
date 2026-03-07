import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import AnimePageSceleton from "~/components/AnimePage/AnimePageSceleton";
import ErrorAnimePage from "~/components/AnimePage/ErrorAnimePage";
import MainComponent from "~/components/AnimePage/MainCompotent";
import Sidebar from "~/components/AnimePage/Sidebar";
import { getAnimeById } from "~/services/jikanApi";
import type { Anime } from "~/types/MyAnimeList.types";

const AnimePage : React.FC = () => {
    let { id } = useParams();
    const { isPending, error, data } = useQuery<Anime>({
            queryKey: ["anime-page",id],
            queryFn: async ()=>{
                const res = await getAnimeById(Number(id));
                console.log(res);
                return res;
            },
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