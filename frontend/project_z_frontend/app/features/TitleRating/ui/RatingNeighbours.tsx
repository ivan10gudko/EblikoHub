import { useEffect, useState } from "react";
import { titleRecordService } from "~/entities/titleRecord/api/titleRecordService";
import type { TitleShortDto } from "~/entities/titleRecord";
import CloseIcon from "@mui/icons-material/Close";

interface RatingNeighborsProps {
  titleId: number;
  category: string;
  ratingValue: number;
  onClose?: () => void;
}

export const RatingNeighborsContent = ({ titleId, category, ratingValue, onClose }: RatingNeighborsProps) => {
  const [neighbors, setNeighbors] = useState<TitleShortDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    titleRecordService
      .getNeighborsRating( titleId, category, ratingValue )
      .then((data) => {
        if (isMounted) {
          setNeighbors(data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch rating neighbors:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [titleId, category, ratingValue]);

  return (
    <div className="flex flex-col gap-2 p-3 bg-card border border-border rounded-xl shadow-2xl min-w-[240px] sm:min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80">
          Live Comparison ({category})
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-1 py-4 text-[11px] font-bold text-foreground text-center">
          Loading comparison...
        </div>
      ) : !neighbors || neighbors.length === 0 || neighbors.length === 1 ? (
        <div className="text-center py-3 text-xs text-foreground">
          No neighbors found for this rating
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 max-h-[180px] overflow-y-auto custom-scrollbar">
          {neighbors.map((item) => {
            const isCurrent = item.titleId === titleId;

            return (
              <div
                key={item.titleId}
                className={`flex items-center justify-between px-2 py-1.5 rounded-md transition-colors text-xs ${
                  isCurrent
                    ? "bg-primary/20 border border-primary/30 font-black text-primary"
                    : "text-foreground/90 font-semibold hover:bg-border/20"
                }`}
              >
                <span className="truncate max-w-[150px] sm:max-w-[190px]">
                  {isCurrent ? "➜ " : ""}
                  {item.titleName}
                </span>
                <span className={`font-mono ${isCurrent ? "text-primary" : "text-foreground/80"}`}> 
                  {item.ratingValue !== undefined && item.ratingValue !== null
                    ? item.ratingValue.toFixed(1)
                    : "0.0"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};