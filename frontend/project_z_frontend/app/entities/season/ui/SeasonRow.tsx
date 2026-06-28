import { useEffect, useState } from "react";
import { type DraftSeason, type Season } from "~/entities/season";
import SeasonStatusSelect from "./SeasonStatusSelect";
import { SeasonActionsMenu } from "./SeasonActionsMenu";
import { CompactRate } from "~/shared/ui/CompactRate";
import { SeasonRowReadOnly } from "./SeasonRowReadOnly";

interface SeasonRowProps {
  season: Season | DraftSeason;
  titleId: number;
  onDelete: () => void;
  onUpdate: (patch: Partial<Season>) => void;
  isOwn: boolean;
  getStatusColor: (value: string | number) => string; // Додали в інтерфейс
}

export const SeasonRow = ({ 
  season, 
  titleId, 
  onDelete, 
  onUpdate, 
  isOwn,
  getStatusColor 
}: SeasonRowProps) => {
  
  if (!isOwn) {
    return <SeasonRowReadOnly season={season} />;
  }

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
    <div className="group flex flex-col sm:flex-row sm:items-center gap-3 bg-card/50 p-3 rounded-2xl border border-border/40 hover:border-primary/40 transition-all">
      
      <div className="flex-1 min-w-0">
        <input
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onBlur={handleNameBlur}
          className="w-full bg-transparent border-none p-0 font-bold uppercase text-[13px] sm:text-[14px] tracking-wide focus:ring-0 focus:text-primary cursor-text transition-colors truncate"
          placeholder="Season name..."
        />
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t border-border/10 sm:border-none pt-2 sm:pt-0">
        
        <div className="w-full max-w-[140px] sm:w-32 flex items-center">
          <SeasonStatusSelect
            initialData={season}
            titleRecord={season}
            onStatusChange={(newStatus) => onUpdate({ status: newStatus })}
            variant="page"
            className="h-9 text-[10px] sm:text-[11px] font-black"
           
            triggerColorClass={getStatusColor(season.status)}
            getOptionClass={getStatusColor}
          />
        </div>

        <div className="flex items-center gap-1">
          <div className="scale-90 sm:scale-100 origin-right">
            <CompactRate
              currentRating={season.rating?.overall}
              onRate={(val) => onUpdate({ rating: { ...season.rating, overall: val } })}
              onClear={() => onUpdate({ rating: undefined })}
            />
          </div>

          <div className="border-l border-border/40 pl-1 ml-1">
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