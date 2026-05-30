import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  StatusSelect,
  TitleTypeThemes,
  type TitleRecord,
} from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../TitleActionsMenu";
import type { Rating } from "~/shared/types";

interface WatchlistRowProps {
  title: TitleRecord;
  isOwn: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export const WatchlistRow = ({
  title,
  isOwn,
  dragHandleProps,
}: WatchlistRowProps) => {
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  useEffect(() => {
    setTempTitleName(title.titleName);
  }, [title.titleName]);

  const navigate = useNavigate();
  const { updateTitle, deleteTitle } = useUpdateTitleRecord(title.titleId);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) {
      navigate(`/anime/${title.apiTitleId}`);
    }
  };

  const handleDelete = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    deleteTitle();
  };

  const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";

  return (
    <div
      className={`group flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full ${themeClasses}`}
    >
      <div className="flex items-center flex-1 gap-3 min-w-0">
        {isOwn && dragHandleProps !== null && dragHandleProps !== undefined && (
          <div
            {...dragHandleProps}
            className={`text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors flex items-center justify-center pl-1 h-10 w-6 ${
              dragHandleProps
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            }`}
          >
            <DragIndicatorIcon sx={{ fontSize: 20 }} />
          </div>
        )}

        <div className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || DEFAULT_IMAGE_PATH}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <div className="flex-1 min-w-0">
          {isOwn ? (
            <input
              name="Title name"
              type="text"
              value={tempTitleName}
              onChange={(e) => setTempTitleName(e.target.value)}
              onBlur={() =>
                tempTitleName !== title.titleName &&
                updateTitle({ titleName: tempTitleName })
              }
              className="w-full font-bold text-foreground uppercase text-xs sm:text-sm bg-transparent border-none p-0 h-auto leading-tight focus:ring-0 cursor-text"
            />
          ) : (
            <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm leading-tight">
              {title.titleName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0">
        <div className="flex-shrink-0">
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

        <div className={!isOwn ? "pointer-events-none opacity-90" : ""}>
          <CompactRate
            currentRating={title.rating?.overall}
            onRate={
              isOwn
                ? (val) =>
                  updateTitle({
                    rating: {
                      ...title.rating,
                      overall: val,   
                    },
                  })
                : undefined
            }
            onClear={
              isOwn
                ? () => {
                  const updatedRating = title.rating
                    ? ({ ...title.rating } as Partial<Rating>)
                    : {};

                  delete updatedRating.overall;

                  updateTitle({ rating: updatedRating as Rating });
                }
                : undefined
            }
          />
        </div>
        {isOwn && (
          <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
            <TitleActionsMenu title={title} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
};
