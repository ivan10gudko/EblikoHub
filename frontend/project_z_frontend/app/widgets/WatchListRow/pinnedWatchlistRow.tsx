import { useNavigate } from "react-router";
import PushPinIcon from "@mui/icons-material/PushPin";
import { StatusSelect, TitleTypeThemes, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { CompactRate } from "~/shared/ui/CompactRate";
import { TitleActionsMenu } from "../TitleActionsMenu";
import type { Rating } from "~/shared/types";

interface PinnedWatchlistRowProps {
    title: TitleRecord;
    isOwn: boolean;
}

export const PinnedWatchlistRow = ({ title, isOwn }: PinnedWatchlistRowProps) => {
    const navigate = useNavigate();

    const { unpinTitle, deleteTitle, updateTitle } = useUpdateTitleRecord(title.titleId);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (title.apiTitleId) navigate(`/anime/${title.apiTitleId}`);
    };

    const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
    const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";

    return (
        <div
            className={`group/pinned flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-primary/5 p-3 rounded-xl border-2 border-primary/40 shadow-md transition-all duration-300 w-full relative ${themeClasses}`}
        >
            <div className="absolute -top-2.5 left-4 bg-primary text-background text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full shadow-sm">
                Pinned Title
            </div>

            <div className="flex items-center flex-1 gap-3 min-w-0">
                {isOwn && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            unpinTitle();
                        }}
                        className="flex items-center justify-center h-10 w-6 text-primary hover:text-destructive transition-colors cursor-pointer pl-1"
                        title="Unpin title"
                    >
                        <PushPinIcon sx={{ fontSize: 16 }} className="group-hover/pinned:scale-110 transition-transform" />
                    </button>
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
                    <span className="block truncate font-black text-foreground uppercase text-xs sm:text-sm tracking-wide">
                        {title.titleName}
                    </span>
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
                                className="h-9 text-xs font-bold bg-background rounded-lg border-primary/20"
                            />
                        </div>
                    ) : (
                        <div className="px-3 py-1.5 bg-transparent text-primary text-[10px] font-black uppercase tracking-wider rounded-lg border border-primary/30">
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
                        <TitleActionsMenu title={title} onDelete={() => deleteTitle()} />
                    </div>
                )}
            </div>
        </div>
    );
};