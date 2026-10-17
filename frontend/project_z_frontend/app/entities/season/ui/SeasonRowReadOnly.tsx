import React from 'react';
import { useNavigate } from "react-router";
import { type DraftSeason, type Season } from "~/entities/season";
import { CompactRate } from "~/shared/ui/CompactRate";
import { ReadOnlyStatusBadge } from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { SeasonTypeThemes } from '../model/season.types';
import { TitleHoverPreview } from '~/shared/ui/HoverPreviewImage';

interface SeasonRowReadOnlyProps {
  season: Season | DraftSeason;
}

export const SeasonRowReadOnly: React.FC<SeasonRowReadOnlyProps> = ({ season }) => {
  const navigate = useNavigate();

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (season.apiTitleId) navigate(`/anime/${season.apiTitleId}`);
  };

  const themeClasses = season.type ? SeasonTypeThemes[season.type] : "";


  return (
    <div
      className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full min-w-0 select-none hover:border-border/80 ${themeClasses}`}
    >
      <div className="flex items-center flex-1 gap-3 min-w-0 max-w-full">
        <div className="relative h-10 w-16 ml-1 flex-shrink-0 cursor-pointer">
          <TitleHoverPreview
            imageUrl={season.imageUrl ?? undefined}
            titleName={season.name || "Season poster"}
            onClick={handleImageClick}
            className="h-full w-full rounded-lg shadow-inner bg-muted/20 flex-shrink-0"
          />
        </div>

        <div className="grid flex-1 min-w-0 px-1">
          <span className="block truncate font-bold text-foreground text-xs sm:text-base leading-tight w-full uppercase">
            {season.name || "Unnamed Season"}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0 flex-shrink-0">
        <ReadOnlyStatusBadge status={season.status} />

        <div className="pointer-events-none opacity-90 flex-shrink-0 p-0.5">
          <CompactRate currentRating={season.rating?.overall} />
        </div>
      </div>
    </div>
  );
};