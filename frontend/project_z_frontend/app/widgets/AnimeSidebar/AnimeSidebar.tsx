import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import type { Anime } from "~/entities/title";
import {
  StatusSelect,
  TitleType,
  useTitleByApiId,
  type CreateTitleRecord,
} from "~/entities/titleRecord";
import { useTitleRecordMutation } from "~/entities/titleRecord";
import { PageRate } from "~/features/manageTitle";
import { Status } from "~/shared/types";
import { Button } from "~/shared/ui/Button";
import { ImageWithFallback } from "~/shared/ui/ImageWithFallback";
import { Sidebar } from "~/shared/ui/Sidebar";
import { TitleActionsMenu } from "../TitleActionsMenu";

//data.images?.jpg?.large_image_url,//check later if it returns "undefined" or "null"
interface Props {
  data: Anime;
}

const AnimeSidebar: React.FC<Props> = ({ data }) => {
  const initialData: CreateTitleRecord = {
    apiTitleId: data.mal_id,
    titleName: data.title,
    status: Status.WATCHED,
    imageUrl: data.images.jpg.image_url,
    titleType: TitleType.ANIME,
    pinned:false,
  };

  const { data: titleRecord } = useTitleByApiId(initialData.apiTitleId);
  const { deleteTitle } = useTitleRecordMutation(
    initialData.apiTitleId,
    initialData,
    titleRecord,
  );
  const handleDelete = () => {
    if (titleRecord) {
      deleteTitle(titleRecord.titleId);
    }
  };
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
      <div className="w-full py-8 flex flex-col gap-4 border rounded-b-xl px-4 border-border shadow">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <StatusSelect initialData={initialData} titleRecord={titleRecord} />
          </div>

          {titleRecord && (
            <div className="flex-shrink-0 border-l border-border pl-1">
              <TitleActionsMenu title={titleRecord} onDelete={handleDelete} isOwn={true} />
            </div>
          )}
        </div>
        <div className="w-full py-4 border-y-border border-y">
          <PageRate initialData={initialData} titleRecord={titleRecord} />
        </div>
        {titleRecord && (
          <Button
            variant="fill"
            className="flex gap-2 w-full bg-danger hover:bg-danger-hover text-white"
            onClick={() => deleteTitle(titleRecord.titleId)}
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
