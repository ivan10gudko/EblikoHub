import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import type { Anime } from "~/entities/title";
import {
    Status,
    useTitleByApiId,
    useTitleRecordMutation,
    type CreateTitleRecord,
} from "~/entities/titleRecord";
import {
    PageRate,
    StatusSelect,
    WatchedButton,
    WatchlistButton,
} from "~/features/manageTitle";
import { Button } from "~/shared/ui/Button";
import { ImageWithFallback } from "~/shared/ui/ImageWithFallback";
import { Sidebar } from "~/shared/ui/Sidebar";

//data.images?.jpg?.large_image_url,//check later if it returns "undefined" or "null"
interface Props {
    data: Anime;
}

const AnimeSidebar: React.FC<Props> = ({ data }) => {
    const initialData: CreateTitleRecord = {
        apiTitleId: data.mal_id,
        titleName: data.title,
        status: Status.WATCHED,
    };

    const { data: titleRecord } = useTitleByApiId(initialData.apiTitleId);
    const {deleteTitle} = useTitleRecordMutation(initialData.apiTitleId,initialData,titleRecord);

    return (
        <Sidebar className="h-fit">
            <div className="w-full relative aspect-[3/4] overflow-hidden rounded-t-xl">
                <ImageWithFallback
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    fallback="/fallbackAnime.png"
                    src={data.images?.jpg?.large_image_url}
                    alt={data.title}
                />
            </div>
            <div className="w-full py-8 flex flex-col gap-4 border rounded-b-xl px-4 border-gray-300 shadow">
                <StatusSelect
                    initialData={initialData}
                    titleRecord={titleRecord}
                />
                <div className="w-full py-4 border-y-gray-300 border-y">
                    <PageRate initialData={initialData} titleRecord={titleRecord} />
                </div>
                {titleRecord && (
                    <Button
                        variant="fill"
                        className="flex gap-2 w-full bg-red-600 hover:bg-red-700 text-white"
                        onClick={()=>deleteTitle(titleRecord.titleId)}
                    >
                        Remove from Library
                        <DeleteForeverIcon />
                    </Button>
                )}
                
            </div>
        </Sidebar>
    );
};

export default AnimeSidebar;
