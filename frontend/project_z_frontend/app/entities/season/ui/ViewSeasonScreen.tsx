import { Button } from "~/shared/ui/Button";
import { CompactRate } from "~/shared/ui/CompactRate";
import EditIcon from "@mui/icons-material/Edit";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";
import { ErrorScreen } from "~/shared/ui/ErrorScreen";
import { SEASON_TYPE_LABELS, SeasonType, type Season } from "~/entities/season/model/season.types";

interface ViewSeasonScreenProps {
    season?: Season | null;
    onClose: () => void;
    onEditClick?: () => void;
    isOwn?: boolean;
}



export const ViewSeasonScreen = ({
    season,
    onClose,
    onEditClick,
    isOwn,
}: ViewSeasonScreenProps) => {
    const currentTypeLabel = season?.type
        ? SEASON_TYPE_LABELS[season.type]
        : "TV";

    return (
        <div className="flex flex-col max-h-[70vh] h-full justify-between p-2">
            {!season ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground animate-pulse text-sm">
                    <ErrorScreen
                        title="Season not found"
                        message="Could not load the details for this season."
                        className="min-h-0 h-full py-8"
                    />
                </div>
            ) : (
                <>
                    <div className="overflow-y-auto flex-1 pr-2 pb-6 space-y-6 custom-scrollbar min-h-0">
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                            <img
                                src={season.imageUrl || "/defaultTitleRecordImage.jpg"}
                                alt={season.name}
                                className="w-42 h-58 object-cover rounded-xl shadow-md border border-border/40 shrink-0"
                            />

                            <div className="flex-1 space-y-4 w-full min-w-0">
                                <div className="min-w-0">
                                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                                        Season Name
                                    </span>
                                    <div className="min-w-0 w-full px-1">
                                        <h2
                                            className="text-2xl font-black text-foreground uppercase leading-tight truncate"
                                            title={season.name}
                                        >
                                            {season.name}
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-1">
                                        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                                            Type
                                        </span>
                                        <span className="font-black text-sm uppercase tracking-wider text-foreground">
                                            {currentTypeLabel}
                                        </span>
                                    </div>

                                    <div className="p-1">
                                        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                                            Status
                                        </span>
                                        <div className="inline-block">
                                            <ReadOnlyStatusBadge status={season.status} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                                        Rating
                                    </span>
                                    <div className="pointer-events-none opacity-90 inline-block p-0.5">
                                        <CompactRate
                                            currentRating={season.rating?.overall}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 border-t border-border/40 pt-4">
                            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block ml-1">
                                Description & Notes
                            </span>
                            <div className="rounded-xl">
                                <div className="w-full p-4 border-2 border-border/60 bg-card/30 rounded-xl font-medium text-foreground text-sm leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                                    {season.description?.trim() ? (
                                        season.description
                                    ) : (
                                        <span className="text-muted-foreground italic opacity-60">
                                            No description provided yet.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto shrink-0">
                <Button
                    onClick={onClose}
                    variant="cancel"
                    className="w-full sm:flex-1"
                >
                    Close
                </Button>

                {isOwn && onEditClick && season && (
                    <Button
                        onClick={onEditClick}
                        variant="save"
                        className="w-full sm:flex-2"
                    >
                        <EditIcon sx={{ fontSize: 18 }} />
                        Edit Details
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ViewSeasonScreen;