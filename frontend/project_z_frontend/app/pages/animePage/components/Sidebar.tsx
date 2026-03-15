import type { Anime } from "~/features/anime/types/MyAnimeList.types";
import type { AnimeCardType } from "../../../features/anime/components/AnimeCard";
import Button from "../../../components/UI/Button";
import AddToWatchedCard from "../../../features/watchlist/components/AddToWathedCard";
import WatchlistButton from "../../../features/watchlist/components/WatchlistButton";
import type { Title } from "~/store/watchlist.store";
import WatchedButton from "../../../features/watchlist/components/WatchedButton";
import RateCard from "./Rate";
import Rate from "./Rate";
import { ImageWithFallback } from "../../../components/UI/ImageWithFallback";

interface Props{
    data: Anime
}

const Sidebar : React.FC<Props> = ({data}) => {
    const item:Title={
        id:data.mal_id,
        title:data.title,
        img:String(data.images?.jpg?.large_image_url),//check later if it returns "undefined" or "null"
    }

    return (
        
            <aside className=" rounded-2xl divide-y text-md md:text-sm " >
                <div className="w-full relative aspect-[3/4] overflow-hidden rounded-t-xl">
                    <ImageWithFallback
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        fallback="/fallbackAnime.png"
                        src={data.images?.jpg?.large_image_url}
                        alt={data.title}
                    />
                </div>
                <div className="w-full py-8 flex flex-col gap-4 border rounded-b-xl px-4 border-gray-200 shadow divide-y divide-gray-200">
                    <div className="flex flex-col gap-4 py-2">
                        <WatchlistButton item={item}/>
                        <WatchedButton item={item}/>
                    </div>
                    <Rate item={item}/>
                </div>
            </aside>
    );
}

export default Sidebar;