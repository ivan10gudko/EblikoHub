import { useState, type ChangeEvent } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";


interface CompactRateProps {
  currentRating?: number;
  onRate?: (value: number) => void;
  onClear?: () => void;
}

export const CompactRate = ({ currentRating, onRate, onClear }: CompactRateProps) => {
  const [value, setValue] = useState<string>(currentRating?.toString() || "");

  const isReadOnly = !onRate || !onClear;

  const handleChange = (val: string) => {
    if (isReadOnly) return; 
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      if (val === "" || Number(val) <= 10) {
        setValue(val);
      }
    }
  };

  const handleSave = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      onRate?.(num); 
    }
  }; 

  return (
    <div className={`flex items-center gap-0 group/rate ${isReadOnly ? "pointer-events-none" : ""}`}>
      <Button
        type="button"
        onClick={() => { onClear?.(); setValue(""); }} 
        disabled={currentRating === undefined || isReadOnly}
        className={`
          flex items-center justify-center w-8 h-full transition-all rounded-none rounded-l-md
          ${currentRating !== undefined && !isReadOnly
            ? "bg-danger text-background hover:bg-danger-hover border-y border-l border-danger" 
            : "bg-background-muted text-foreground-muted border-y border-l border-border cursor-not-allowed"}
        `}
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </Button>

      <div className="relative flex items-center">
        <Input
          type="text"
          readOnly={isReadOnly}
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className={`
            my-0 rounded-none w-12 font-bold text-center py-1.5 text-sm outline-none border
            ${isReadOnly 
              ? "bg-background-muted text-foreground-muted border-border" 
              : "bg-background-muted text-primary border-primary focus:ring-1 focus:ring-primary"}
          `}
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={isReadOnly}
        className={`
          px-2 py-1.5 transition-colors rounded-none rounded-r-md
          ${isReadOnly 
            ? "bg-background text-foreground-muted border-y border-r border-border" 
            : "bg-primary hover:bg-primary-hover text-background"}
        `}
      >
        <DoneOutlinedIcon sx={{ fontSize: 18 }} />
      </Button>
    </div>
  );
};