import { useNavigate } from "react-router";
import { ReadOnlyStatusBadge, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import { useTitleFilterStore, type TitleSortType } from "~/features/titleFilter/store/titleFilter.store";


interface WatchlistRowReadOnlyProps {
  title: TitleRecord;
}

export const WatchlistRowReadOnly = ({ title }: WatchlistRowReadOnlyProps) => {
  const navigate = useNavigate();

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
  };

  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
  const sortBy = useTitleFilterStore((state) => state.sortBy);
  const isAvgView = sortBy === "avgRating" as TitleSortType;

  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full min-w-0 ${themeClasses} ${
        title.pinned ? "border-primary/30" : ""
      }`}
    >
      <div className="flex items-center flex-1 gap-3 min-w-0 overflow-hidden max-w-full">
        <div className="relative h-10 w-16 flex-shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-10 cursor-pointer">
          <img
            src={title.imageUrl || "/defaultTitleRecordImage.jpg"}
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

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
        
        <ReadOnlyStatusBadge status={title.status} />

        <div className="pointer-events-none opacity-90 flex-shrink-0">
          <CompactRate
            currentRating={title.rating?.overall} 
            avgRating={title.avgRating}
            isAvgView={isAvgView} 
          />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu title={title} isOwn={false} />
        </div>
      </div>
    </div>
  );
};