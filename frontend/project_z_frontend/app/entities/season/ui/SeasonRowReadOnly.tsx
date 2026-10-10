import React from 'react';
import { type DraftSeason, type Season } from "~/entities/season";
import { CompactRate } from "~/shared/ui/CompactRate";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";

interface SeasonRowReadOnlyProps {
  season: Season | DraftSeason;
}

export const SeasonRowReadOnly: React.FC<SeasonRowReadOnlyProps> = ({ season }) => {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-3 bg-card/50 p-3 px-4 rounded-2xl border border-border/20 transition-all select-none">
      
      <div className="flex-1 min-w-0">
        <span className="w-full font-bold uppercase text-[13px] sm:text-[14px] tracking-wide text-foreground/75 cursor-default truncate block">
          {season.name || "Unnamed Season"}
        </span>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 border-t border-border/10 sm:border-none pt-2 sm:pt-0">
        <div className="w-full max-w-[140px] sm:w-32 flex items-center">
          <ReadOnlyStatusBadge status={season.status} />
        </div>

        <div className="flex items-center gap-1">
          <div className="scale-90 sm:scale-100 origin-right">
            <CompactRate currentRating={season.rating?.overall} />
          </div>
        </div>
      </div>

    </div>
  );
};