import React from "react";
import { cn } from "~/shared/lib/utils";

interface CompactRatingLabelProps {
  rating?: number | null;
  label?: string;
  className?: string;
}

export const CompactRatingLabel = ({
  rating,
  label,
  className,
}: CompactRatingLabelProps) => {
  const hasRating = rating !== undefined && rating !== null;

  return (
    <div
      className={cn(
        "flex items-center justify-center h-[34px] min-w-[34px] bg-background-muted/10 border border-border rounded-lg overflow-hidden select-none",
        className
      )}
    >
      {label && (
        <div className="flex items-center justify-center px-2 h-full bg-background-muted/20 text-xs text-foreground-muted border-r border-border leading-none">
          {label}
        </div>
      )}

      <div className="flex items-center justify-center h-full px-2">
        <span
          className={cn(
            "text-sm leading-none pt-[1px]",
            hasRating ? "font-black text-primary" : "text-foreground-muted"
          )}
        >
          {hasRating ? rating.toFixed(1) : "—"}
        </span>
      </div>
    </div>
  );
};