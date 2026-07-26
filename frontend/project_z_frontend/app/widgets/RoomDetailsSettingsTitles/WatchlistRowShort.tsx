import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { ReadOnlyStatusBadge, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { CompactRatingLabel } from "~/shared/ui/Rating";

interface WatchlistDragRowProps {
    title: TitleRecord;
    dragHandleProps?: DraggableProvidedDragHandleProps | null;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const WatchlistRowShort = ({ title, dragHandleProps }: WatchlistDragRowProps) => {
    const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";

    return (
        <div className={`group/row flex items-center justify-between gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full ${themeClasses}`}>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div {...dragHandleProps} className="text-muted-foreground/40 group-hover/row:text-muted-foreground/70 cursor-grab active:cursor-grabbing flex-shrink-0">
                    <DragIndicatorIcon sx={{ fontSize: 20 }} />
                </div>

                <div className="relative h-10 w-16 flex-shrink-0">
                    <img src={title.imageUrl || DEFAULT_IMAGE_PATH} className="h-full w-full object-cover rounded-md" alt={title.titleName} />
                </div>

                <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm leading-tight flex-1">
                    {title.titleName}
                </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <ReadOnlyStatusBadge
                    status={title.status}
                />

                <CompactRatingLabel
                    rating={title.rating?.overall}
                />
            </div>
        </div>
    );
};