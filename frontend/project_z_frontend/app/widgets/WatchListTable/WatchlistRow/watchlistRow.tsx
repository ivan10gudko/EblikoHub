import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import { useNavigate } from "react-router";
import { StatusSelect, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import type { Rating } from "~/shared/types";
import {
  useTitleFilterStore,
  type TitleSortType,
} from "~/features/titleFilter/store/titleFilter.store";

interface WatchlistRowProps {
  title: TitleRecord;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
  index: number;
  showNumber: boolean;
  onOpenRatingModal: () => void;
}

export const WatchlistRow = ({
  title,
  dragHandleProps,
  index,
  showNumber,
  onOpenRatingModal,
}: WatchlistRowProps) => {
  const navigate = useNavigate();
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  const { pinTitle, updateTitle, deleteTitle } = useUpdateTitleRecord(title.titleId);
  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === ("avgRating" as TitleSortType);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };

  const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";

  return (
    <div
      className={`group/row flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full ${themeClasses} ${
        title.pinned ? "border-primary/30" : ""
      }`}
    >
      <div className="flex items-center flex-1 gap-1.5 min-w-0">
        {!title.pinned && (
          <div className="flex items-center justify-center h-10 w-5 select-none flex-shrink-0">
            {showNumber ? (
              <span translate="no" className="text-gray-400 font-bold text-sm sm:text-base">
                {index + 1}
              </span>
            ) : (
              dragHandleProps && (
                <div
                  {...dragHandleProps}
                  className="text-muted-foreground/40 group-hover/row:text-muted-foreground/70 transition-colors flex items-center justify-center cursor-grab active:cursor-grabbing w-full h-full"
                >
                  <DragIndicatorIcon sx={{ fontSize: 20 }} />
                </div>
              )
            )}
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            pinTitle();
          }}
          className="flex items-center justify-center h-10 w-5 text-muted-foreground/20 group-hover/row:text-muted-foreground/60 hover:!text-primary opacity-100 sm:opacity-0 md:group-hover/row:opacity-100 transition-all duration-200 cursor-pointer"
          title="Pin title to the top"
        >
          <PushPinIcon
            sx={{ fontSize: 16 }}
            className="-rotate-45 group-hover/row:rotate-0 transition-transform duration-200"
          />
        </button>

        <div className="relative h-10 w-16 ml-1 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || DEFAULT_IMAGE_PATH}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <div className="flex-1 min-w-0">
          <input
            name="Title name"
            type="text"
            value={tempTitleName}
            onChange={(e) => setTempTitleName(e.target.value)}
            onBlur={() =>
              tempTitleName !== title.titleName && updateTitle({ titleName: tempTitleName })
            }
            className="w-full font-bold text-foreground uppercase text-xs sm:text-sm bg-transparent border-none p-0 h-auto leading-tight focus:ring-0 cursor-text"
          />
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0">
        <div className="flex-shrink-0 w-32 sm:w-40">
          <StatusSelect
            variant="page"
            initialData={title}
            titleRecord={title}
            className="h-9 text-xs font-bold bg-transparent rounded-lg"
          />
        </div>

        <div>
          <CompactRate
            isAvgView={isAvgView}
            currentRating={title.rating?.overall}
            avgRating={title.avgRating}
            onRate={(val) =>
              updateTitle({
                rating: {
                  ...title.rating,
                  overall: val,
                },
              })
            }
            onClear={() => {
              const updatedRating = title.rating ? ({ ...title.rating } as Partial<Rating>) : {};
              delete updatedRating.overall;
              updateTitle({ rating: updatedRating as Rating });
            }}
          />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu
            title={title}
            onDelete={() => deleteTitle()}
            isOwn={true}
            onOpenRatingModal={onOpenRatingModal}
          />
        </div>
      </div>
    </div>
  );
};
