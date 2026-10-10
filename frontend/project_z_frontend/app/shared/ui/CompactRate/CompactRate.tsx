import { useState, useEffect } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "~/shared/ui/Button";
import { formatRatingInput } from "~/shared/helpers/formatRating";

interface CompactRateProps {
  currentRating?: number | null;
  avgRating?: number | null;
  isAvgView?: boolean;
  onRate?: (val: number) => void;
  onClear?: () => void;
  isOwn?: boolean;
}

export const CompactRate = ({
  currentRating,
  avgRating,
  isAvgView,
  onRate,
  onClear,
  isOwn = true,
}: CompactRateProps) => {
  const hasRating = currentRating !== undefined && currentRating !== null;
  const [value, setValue] = useState<string>(hasRating ? currentRating.toString() : "");

  const isReadOnly = !onRate || !onClear || !isOwn;

  useEffect(() => {
    setValue(hasRating ? currentRating.toString() : "");
  }, [currentRating, hasRating]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isReadOnly) return;

    const formatted = formatRatingInput(val);
    if (formatted !== null) {
      setValue(formatted);
    }
  };

  const handleSave = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      onRate?.(num);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSave();
  };

  if (isAvgView) {
  return (
    <div className="flex items-center h-[34px] w-[88px] bg-transparent border border-border rounded-md px-2 justify-between">
      <span className="text-md font-bold text-primary">
        {avgRating ? avgRating.toFixed(1) : "—"}
      </span>
      {currentRating !== undefined && currentRating !== null ? (
        <span className="text-md text-foreground">
          {currentRating}
        </span>
      ) : (
        <span className="text-[10px] text-foreground">—</span>
      )}
    </div>
  );
}

return (
  <form
    onSubmit={handleSubmit}
    className={`flex items-center gap-0 group/rate ${isReadOnly ? "pointer-events-none select-none" : ""}`}
  >
    <Button
      type="button"
      onClick={onClear}
      disabled={isReadOnly}
      className={`
          flex items-center justify-center w-8 h-[34px] transition-all rounded-none rounded-l-md border-none
          ${isReadOnly
          ? "bg-background-muted/20 text-foreground-muted/40"
          : hasRating
            ? "bg-danger text-background hover:bg-danger/90"
            : "bg-background-muted text-foreground-muted hover:bg-background-muted/80"
        }
        `}
    >
      <ClearIcon sx={{ fontSize: 16 }} />
    </Button>

    <div className="relative flex items-center">
      <input
        type="text"
        readOnly={isReadOnly}
        value={value}
        onChange={handleChange}
        placeholder="0.0"
        name="rate"
        className={`
            my-0 rounded-none w-12 font-black text-center h-[34px] text-sm outline-none border-y border-l
            ${isReadOnly
            ? "bg-background-muted/40 text-primary border-border"
            : "bg-background-muted text-primary border-primary focus:ring-1 focus:ring-primary"
          }
          `}
      />
    </div>

    <Button
      type="submit"
      disabled={isReadOnly}
      className={`
          flex items-center justify-center px-2 h-[34px] transition-colors rounded-none rounded-r-md border-y border-r
          ${isReadOnly
          ? "bg-background-muted/20 text-foreground-muted/40 border-border"
          : "bg-primary text-background border-primary hover:bg-primary/90"
        }
        `}
    >
      <DoneOutlinedIcon sx={{ fontSize: 18 }} />
    </Button>
  </form>
);
};