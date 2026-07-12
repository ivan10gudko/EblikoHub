import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PushPinIcon from "@mui/icons-material/PushPin";
import { StatusSelect, TitleTypeThemes, TitlePinnedThemes, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import type { Rating } from "~/shared/types";
import { useTitleFilterStore, type TitleSortType } from "~/features/titleFilter/store/titleFilter.store";

interface PinnedWatchlistRowProps {
  title: TitleRecord;
  onOpenRatingModal: () => void;
}

export const PinnedWatchlistRow = ({ title, onOpenRatingModal }: PinnedWatchlistRowProps) => {
  const navigate = useNavigate();
  const [tempTitleName, setTempTitleName] = useState(title.titleName);
  
  const { unpinTitle, deleteTitle, updateTitle } = useUpdateTitleRecord(title.titleId);
  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === ("avgRating" as TitleSortType);

  useEffect(() => {
    setTempTitleName(title.titleName);
  }, [title.titleId, title.titleName]);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };

  const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
  
  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
  const pinnedClasses = title.titleType ? TitlePinnedThemes[title.titleType] : "";

  return (
    <div
      className={`group/pinned flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-2 rounded-xl border-2 transition-all duration-300 w-full relative ${themeClasses} ${pinnedClasses}`}
    >
      <div className="absolute -top-2.5 left-4 bg-primary text-background text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm z-10 pointer-events-none">
        Pinned Title
      </div>

      <div className="flex items-center flex-1 gap-1.5 min-w-0">
        <div className="flex items-center justify-center h-10 w-5 select-none flex-shrink-0" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            unpinTitle();
          }}
          className="flex items-center justify-center h-10 w-5 text-primary transition-colors cursor-pointer shrink-0"
          title="Unpin title"
        >
          <PushPinIcon
            sx={{ fontSize: 16 }}
            className="scale-110 group-hover/pinned:scale-125 transition-transform"
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
              tempTitleName !== title.titleName &&
              updateTitle({ titleName: tempTitleName })
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
            avgRating={title.avgRating}
            isAvgView={isAvgView}
            currentRating={title.rating?.overall}
            onRate={(val) =>
              updateTitle({
                rating: {
                  ...title.rating,
                  overall: val,
                },
              })
            }
            onClear={() => {
              const updatedRating = title.rating
                ? ({ ...title.rating } as Partial<Rating>)
                : {};
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