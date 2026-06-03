import { useNavigate } from "react-router";
import { TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../../TitleActionsMenu";
import { Status, statusColorConfig } from "~/shared/types/Status";

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

  const currentStatus = (title?.status as Status) || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];

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
        <div className="relative flex items-center flex-shrink-0 pl-7 pr-3 py-1.5 bg-transparent text-[10px] font-black uppercase tracking-wider rounded-lg border border-border min-w-[110px]">
          {currentStatus !== Status.DEFAULT && (
            <div
              className={`absolute left-2.5 w-1.5 h-1.5 rounded-full z-10 pointer-events-none ${config.dot}`}
            />
          )}

          <span
            className={`transition-all select-none capitalize ${
              currentStatus !== Status.DEFAULT ? config.color : "text-foreground-muted"
            }`}
          >
            {title.status === "INPROGRESS"
              ? "In Progress"
              : title.status === "WATCHED"
                ? "Watched"
                : (title.status || "No Status")}
          </span>
        </div>

        <div className="pointer-events-none opacity-90 flex-shrink-0">
          <CompactRate currentRating={title.rating?.overall} />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <TitleActionsMenu title={title} isOwn={false} />
        </div>
      </div>
    </div>
  );
};