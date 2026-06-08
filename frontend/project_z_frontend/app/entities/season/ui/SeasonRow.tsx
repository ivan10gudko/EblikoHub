import { useEffect, useState } from "react";
import { type DraftSeason, type Season } from "~/entities/season";
import SeasonStatusSelect from "./SeasonStatusSelect";
import { SeasonActionsMenu } from "./SeasonActionsMenu";
import { CompactRate } from "~/shared/ui/CompactRate";

interface SeasonRowProps {
    season: Season | DraftSeason;
    titleId: number;
    onDelete: () => void;
    onUpdate: (patch: Partial<Season>) => void;
    isOwn: boolean;
}

export const SeasonRow = ({ season, titleId, onDelete, onUpdate, isOwn }: SeasonRowProps) => {
    const [localName, setLocalName] = useState(season.name);

    useEffect(() => {
        setLocalName(season.name);
    }, [season.name]);

    const handleNameBlur = () => {
        if (localName !== season.name && localName.trim()) {
            onUpdate({ name: localName });
        }
    };

    const getStatusLabel = (status?: string) => {
        if (status === "WATCHING" || status === "IN_PROGRESS") return "In Progress";
        if (status === "COMPLETED") return "Completed";
        return status || "In Progress";
    };

    return (
        <div className={`group flex flex-col sm:flex-row sm:items-center gap-3 bg-card/50 p-3 rounded-2xl border transition-all ${
            isOwn ? "border-border/40 hover:border-primary/40" : "border-border/20 px-4 select-none"
        }`}>
            
            <div className="flex-1 min-w-0">
                <input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={handleNameBlur}
                    disabled={!!isOwn}
                    className={`w-auto bg-transparent border-none p-0 font-bold uppercase text-[13px] sm:text-[14px] tracking-wide focus:ring-0 transition-colors truncate ${
                        isOwn ? "focus:text-primary cursor-text" : "cursor-default text-foreground/80"
                    }`}
                    placeholder="Season name..."
                />
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t border-border/10 sm:border-none pt-2 sm:pt-0">
                
                <div className="w-full max-w-[140px] sm:w-32 flex items-center">
                    {!isOwn ? (
                        <div className="h-9 px-3 bg-[#1c1c1c] border border-neutral-800/60 rounded-xl flex items-center text-[11px] font-black text-neutral-400 gap-2 w-max select-none pointer-events-none uppercase tracking-wide">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                            {getStatusLabel(season.status)}
                        </div>
                    ) : (
                        <SeasonStatusSelect
                            initialData={season}
                            titleRecord={season}
                            onStatusChange={(newStatus) => onUpdate({ status: newStatus })}
                            variant="page"
                            className="h-9 text-[10px] sm:text-[11px] font-black"
                        />
                    )}
                </div>

                <div className="flex items-center gap-1">
                    <div className="scale-90 sm:scale-100 origin-right">
                        {!isOwn ? (
                             <CompactRate
                                currentRating={season.rating?.overall}
                            />
                        ) : (
                            <CompactRate
                                currentRating={season.rating?.overall}
                                onRate={(val) => onUpdate({ rating: { ...season.rating, overall: val } })}
                                onClear={() => onUpdate({ rating: undefined })}
                            />
                        )}
                    </div>

                    {isOwn && (
                        <div className="border-l border-border/40 pl-1 ml-1">
                            <SeasonActionsMenu
                                season={season}
                                onDelete={onDelete}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};