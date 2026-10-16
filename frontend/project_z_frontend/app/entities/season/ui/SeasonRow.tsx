import { useEffect, useState } from "react";
import { type DraftSeason, type Season } from "~/entities/season";
import SeasonStatusSelect from "./SeasonStatusSelect";
import { SeasonActionsMenu } from "./SeasonActionsMenu";
import { CompactRate } from "~/shared/ui/CompactRate";
import { SeasonRowReadOnly } from "./SeasonRowReadOnly";
import { getStatusColor } from "~/shared/utils";
import { TitleTypeThemes } from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { useNavigate } from "react-router";
import { SeasonTypeThemes } from "../model/season.types";
import { TitleHoverPreview } from "~/shared/ui/HoverPreviewImage";

interface SeasonRowProps {
  season: Season | DraftSeason;
  titleId: number;
  onDelete: () => void;
  onUpdate: (patch: Partial<Season>) => void;
  isOwn: boolean;
}

export const SeasonRow = ({
  season,
  titleId,
  onDelete,
  onUpdate,
  isOwn,
}: SeasonRowProps) => {
  const navigate = useNavigate();

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

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (season.apiTitleId) navigate(`/anime/${season.apiTitleId}`);
  };

  const themeClasses = season.type ? SeasonTypeThemes[season.type] : "";

  return (
    <div
      className={`group/row flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 bg-card p-2 rounded-xl border transition-all duration-300 w-full ${themeClasses}`}
    >
      <div className="flex items-center flex-1 gap-2.5 min-w-0">
        <div className="relative h-10 w-16 ml-1 flex-shrink-0 cursor-pointer">
          <TitleHoverPreview
            imageUrl={season.imageUrl ?? undefined}
            titleName={season.name || "Season poster"}
            onClick={handleImageClick}
            className="h-full w-full rounded-lg shadow-inner bg-muted/20 flex-shrink-0"
          />
        </div>

        <div className="flex-1 min-w-0">
          <input
            name="Season name"
            type="text"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleNameBlur}
            className="w-full font-bold text-foreground sm:text-base bg-transparent border-none p-0 h-auto leading-tight focus:ring-0 cursor-text uppercase"
            placeholder="Season name..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:w-auto mt-2 sm:mt-0">
        <div className="flex-shrink-0 w-32 sm:w-40">
          <SeasonStatusSelect
            initialData={season}
            titleRecord={season}
            onStatusChange={(newStatus) => onUpdate({ status: newStatus })}
            variant="page"
            className="h-9 text-xs font-bold bg-transparent rounded-lg"
            triggerColorClass={getStatusColor(season.status)}
          />
        </div>

        <div>
          <CompactRate
            currentRating={season.rating?.overall}
            onRate={(val) =>
              onUpdate({ rating: { ...season.rating, overall: val } })
            }
            onClear={() => onUpdate({ rating: undefined })}
          />
        </div>

        <div className="flex-shrink-0 ml-1 border-l border-border pl-2">
          <SeasonActionsMenu
            titleId={titleId}
            isOwn={isOwn}
            season={season}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
};