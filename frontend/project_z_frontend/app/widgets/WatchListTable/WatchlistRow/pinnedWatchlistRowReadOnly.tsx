import React from 'react';
import { useNavigate } from "react-router";
import { ReadOnlyStatusBadge, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import { useTitleFilterStore, type TitleSortType } from "~/features/titleFilter/store/titleFilter.store";

interface PinnedWatchlistRowReadOnlyProps {
  title: TitleRecord;
  onOpenRatingModal: (title: TitleRecord) => void;
  onRowClick: (title: TitleRecord) => void;
}

export const PinnedWatchlistRowReadOnly = ({ title, onOpenRatingModal, onRowClick }: PinnedWatchlistRowReadOnlyProps) => {
  const navigate = useNavigate();

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };

  const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";

  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === "avgRating" as TitleSortType;

  return (
    <div
      onClick={() => onRowClick(title)}
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-primary/5 p-3 rounded-xl border-2 border-primary/40 shadow-md transition-all duration-300 w-full min-w-0 relative cursor-pointer hover:border-primary/60 ${themeClasses}`}
    >
      <div className="absolute -top-2.5 left-4 bg-primary text-background text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm">
        Pinned Title
      </div>

      <div className="flex items-center flex-1 gap-3 min-w-0 max-w-full">
        <div className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || DEFAULT_IMAGE_PATH}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleName}
          />
        </div>

        <div className="grid flex-1 min-w-0">
          <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm leading-tight w-full">
            {title.titleName}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <ReadOnlyStatusBadge status={title.status} />

        <div className="pointer-events-none opacity-90 flex-shrink-0">
          <CompactRate currentRating={title.rating?.overall} avgRating={title.avgRating} isAvgView={isAvgView}  />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu title={title} isOwn={false} onOpenRatingModal={() => onOpenRatingModal(title)}/>
        </div>
      </div>
    </div>
  );
};