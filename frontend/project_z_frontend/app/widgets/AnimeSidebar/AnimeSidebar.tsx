import type { Anime } from "~/entities/title";
import { Status, useTitleByApiId, type CreateTitleRecord } from "~/entities/titleRecord";
import { PageRate, WatchedButton, WatchlistButton } from "~/features/manageTitle";
import { ImageWithFallback } from "~/shared/ui/ImageWithFallback";
import { Sidebar } from "~/shared/ui/Sidebar";

//data.images?.jpg?.large_image_url,//check later if it returns "undefined" or "null"
interface Props{
    data: Anime;
}

const AnimeSidebar : React.FC<Props> = ({data}) => {
    const initialData:CreateTitleRecord={
        apiTitleId:data.mal_id,
        titleName:data.title,
        status: Status.WATCHED
    }

    const { data: titleRecord} = useTitleByApiId(initialData.apiTitleId);

    return (
            <Sidebar>
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
                        <WatchlistButton initialData={initialData} titleRecord={titleRecord}/>
                        <WatchedButton initialData={initialData} titleRecord={titleRecord}/>
                    </div>
                    <PageRate initialData={initialData} titleRecord={titleRecord}/>
                </div>
            </Sidebar>
    );
}

export default AnimeSidebar;