import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { ReadOnlyStatusBadge, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRate } from "~/shared/ui/CompactRate";

interface WatchlistDragRowProps {
  title: TitleRecord;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

export const WatchlistRowShort = ({ title, dragHandleProps }: WatchlistDragRowProps) => {

  const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
  const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

  return (
    <div className={`group/row flex items-center gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full ${themeClasses}`}>
      
      <div {...dragHandleProps} className="text-muted-foreground/40 group-hover/row:text-muted-foreground/70 cursor-grab active:cursor-grabbing">
        <DragIndicatorIcon sx={{ fontSize: 20 }} />
      </div>


      <div className="relative h-10 w-16 flex-shrink-0">
        <img src={title.imageUrl || DEFAULT_IMAGE_PATH} className="h-full w-full object-cover rounded-md" alt={title.titleName} />
      </div>

      <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm leading-tight w-full">
            {title.titleName}
          </span>

      <div className="flex items-center gap-4">
        <ReadOnlyStatusBadge
          status={title.status}
        />
        
        <CompactRate
          isAvgView={false}
          currentRating={title.rating?.overall}
          avgRating={title.avgRating}
        />
      </div>
    </div>
  );
};
