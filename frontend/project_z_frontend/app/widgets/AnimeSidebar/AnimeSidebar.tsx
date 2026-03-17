
import type { Title } from "~/legacy/store/watchlist.store";
import { ImageWithFallback } from "../../shared/ui/ImageWithFallback/ImageWithFallback";
import type { Anime } from "~/entities/title";
import WatchlistButton from "~/features/watchlist/ui/WatchlistButton";
import WatchedButton from "~/features/watchlist/ui/WatchedButton";
import { PageRate } from "~/features/rating";

interface Props{
    data: Anime;
}

const AnimeSidebar : React.FC<Props> = ({data}) => {
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
                    <PageRate item={item}/>
                </div>
            </aside>
    );
}

export default AnimeSidebar;