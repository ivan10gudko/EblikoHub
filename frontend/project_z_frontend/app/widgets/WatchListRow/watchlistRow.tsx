import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CompactRate,
  type Status,
  type TitleRecord,
} from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { StatusSelect } from "~/features/manageTitle";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";

interface WatchlistRowProps {
  title: TitleRecord;
  isOwn: boolean;
}
export const WatchlistRow = ({ title, isOwn }: WatchlistRowProps) => {
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  const navigate = useNavigate();
  const { updateTitle, deleteTitle } = useUpdateTitleRecord(title.titleId);
  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) {
      navigate(`/anime/${title.apiTitleId}`);
    }
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTitle();
  };

  return (
    <div className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border border-border transition-all w-full">
      <div className="flex items-center flex-1 gap-3 min-w-0">
        {isOwn && (
          <div onPointerDown={(e) => e.stopPropagation()}>
            <Button
              variant="fill"
              onClick={handleDelete}
              className="p-1.5 bg-danger hover:bg-danger-hover rounded-lg"
            >
              <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            </Button>
          </div>
        )}

        <div
          className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[2.5] hover:z-10"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <img
            src={title.imageUrl || "/defautlTitleRecordImage.jpg"}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md cursor-pointer"
            alt={title.titleName}
          />
        </div>

        <div
          className="flex-1 min-w-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isOwn ? (
            <Input
              name="Title name"
              type="text"
              value={tempTitleName}
              onChange={(val) => setTempTitleName(val)}
              onBlur={() =>
                tempTitleName !== title.titleName &&
                updateTitle({ titleName: tempTitleName })
              }
              className="w-full font-bold text-foreground uppercase text-xs sm:text-sm bg-transparent border-none p-0 h-auto leading-tight focus:ring-0"
            />
          ) : (
            <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm leading-tight">
              {title.titleName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0">
        <div
          className="flex-shrink-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          {isOwn ? (
            <div className="w-32 sm:w-40">
              <StatusSelect
                variant="page"
                initialData={title}
                titleRecord={title}
                className="h-9 text-xs font-bold bg-transparent rounded-lg"
              />
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-transparent text-primary text-[10px] font-black uppercase tracking-wider rounded-lg border border-border">
              {title.status || "No Status"}
            </div>
          )}
        </div>

        <div
          onPointerDown={(e) => e.stopPropagation()}
          className={!isOwn ? "pointer-events-none opacity-90" : ""}
        >
          <CompactRate
            currentRating={title.rating?.overall}
            onRate={
              isOwn
                ? (val) => updateTitle({ rating: { overall: val } })
                : undefined
            }
            onClear={
              isOwn ? () => updateTitle({ rating: undefined }) : undefined
            }
          />
        </div>
      </div>
    </div>
  );
};
