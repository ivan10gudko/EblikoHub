import { useEffect, useState } from "react";
import { type DraftSeason, type Season } from "~/entities/season";
import SeasonStatusSelect from "./SeasonStatusSelect";
import { SeasonActionsMenu } from "./SeasonActionsMenu";
import { CompactRate } from "~/shared/ui/CompactRate";

interface SeasonRowProps {
    season: Season | DraftSeason
    titleId: number;
    onDelete: () => void;
    onUpdate: (patch: Partial<Season>) => void;
}

export const SeasonRow = ({ season, titleId, onDelete, onUpdate }: SeasonRowProps) => {
    const [localName, setLocalName] = useState(season.name);

    useEffect(() => {
        setLocalName(season.name);
    }, [season.name]);

    const handleNameBlur = () => {
        if (localName !== season.name && localName.trim()) {
            onUpdate({ name: localName });
        }
    };

    return (
        <div className="group flex items-center gap-3 bg-card/50 p-2 pl-3 rounded-xl border border-border/40 hover:border-primary/40 transition-all">

            <div className="flex-1 min-w-0">
                <input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={handleNameBlur}
                    className="w-auto bg-transparent border-none p-0 font-bold uppercase text-[13px] tracking-wide focus:ring-0 focus:text-primary transition-colors"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="w-32">
                    <SeasonStatusSelect
                        initialData={season}
                        titleRecord={season}
                        onStatusChange={(newStatus) => onUpdate({ status: newStatus })}
                        variant="page"
                        className="h-9 text-[11px] font-black"
                    />
                </div>

                <div className="flex items-center scale-90 origin-right">
                    <CompactRate
                        currentRating={season.rating?.overall}
                        onRate={(val) => onUpdate({ rating: { overall: val } })}
                        onClear={() => onUpdate({ rating: undefined })}
                    />

                    <div className="border-l border-border/40 pl-2 ml-1">
                        <SeasonActionsMenu
                            season={season}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};