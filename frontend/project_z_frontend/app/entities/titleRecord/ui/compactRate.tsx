import { useState, type ChangeEvent } from "react";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";


interface CompactRateProps {
  currentRating?: number;
  onRate: (value: number) => void;
  onClear: () => void;
}

export const CompactRate = ({ currentRating, onRate, onClear }: CompactRateProps) => {
  const [value, setValue] = useState<string>(currentRating?.toString() || "");

  const handleChange = (val: string) => {
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      if (val === "" || Number(val) <= 10) {
        setValue(val);
      }
    }
  };

  const handleSave = () => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 10) {
      onRate(num);
    }
  };

  return (
    <div className="flex items-center gap-0 group/rate">
        <Button
        type="button"
        onClick={() => { onClear(); setValue(""); }}
        disabled={currentRating === undefined}
        className={`
          flex items-center justify-center w-8 h-full rounded-l-md transition-all rounded-none
          ${currentRating !== undefined 
            ? "bg-red-500 text-white-100 hover:bg-red-500 hover:text-white border-y border-l border-red-200" 
            : "bg-gray-50 text-gray-300 border-y border-l border-gray-200 cursor-not-allowed"}
        `}
      >
        <ClearIcon sx={{ fontSize: 16 }} />
      </Button>
      <div className="relative flex items-center">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0.0"
          className="my-0 rounded-none w-12 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-center py-1.5 text-sm focus:ring-1 focus:ring-amber-400 outline-none"
        />
        
      </div>

      <Button
        onClick={handleSave}
        className="bg-amber-400 hover:bg-amber-500 text-white px-2 py-1.5 rounded-r-md transition-colors rounded-none"
      >
        <DoneOutlinedIcon sx={{ fontSize: 18 }} />
      </Button>
    </div>
  );
};