import { useEffect, useState, useRef } from "react";
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
  
  const containerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    titleRecordService
      .getSameCriteriaRating(titleId, category, ratingValue)
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

  useEffect(() => {
    if (!isLoading && neighbors.length > 0 && currentItemRef.current && containerRef.current) {
      const timeoutId = setTimeout(() => {
        currentItemRef.current?.scrollIntoView({
          behavior: "smooth", 
          block: "center",   
        });
      }, 80); 

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, neighbors, titleId]);

  return (
    <div className="flex flex-col gap-2 p-3 bg-card border border-border rounded-xl shadow-2xl w-full min-w-[240px] sm:min-w-[280px] max-w-[320px] md:max-w-[350px]">
      <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/80 truncate max-w-[80%]">
          Live Comparison ({category})
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-border/40 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-1 py-6 text-[11px] font-bold text-foreground/70 text-center">
          Loading comparison...
        </div>
      ) : !neighbors || neighbors.length === 0 ? (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No records found
        </div>
      ) : (
        <div 
          ref={containerRef} 
          className="flex flex-col gap-0.5 max-h-[285px] overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar scroll-smooth"
        >
          {neighbors.map((item) => {
            const isCurrent = item.titleId === titleId;

            return (
              <div
                key={item.titleId}
                ref={isCurrent ? currentItemRef : null}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-md transition-all text-xs ${
                  isCurrent
                    ? "bg-primary/20 border border-primary/40 font-black text-primary shadow-sm"
                    : "text-foreground/90 font-semibold hover:bg-border/30"
                }`}
              >
                <span className="truncate max-w-[160px] sm:max-w-[200px] md:max-w-[230px] flex items-center gap-1">
                  {isCurrent && <span className="text-primary text-[10px]">➜</span>}
                  {item.titleName}
                </span>

                <span className={`font-mono text-[11px] ${isCurrent ? "text-primary font-bold" : "text-foreground/70"}`}>
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