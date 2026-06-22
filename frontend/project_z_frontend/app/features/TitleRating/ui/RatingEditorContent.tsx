import { useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CalculateIcon from "@mui/icons-material/Calculate";
import { Button } from "~/shared/ui/Button";
import { CompactRate } from "../../../shared/ui/CompactRate";
import { CategoryRow } from "./RatingRow";
import type { Rating } from "~/shared/types";

interface RatingEditorContentProps {
  titleId: number;
  ratings: Rating;
  onChange: (newRatings: Rating) => void;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
  onTitleChange?: (newTitleId: number) => void;
}

const PRESET_CATEGORIES = [
  { id: "story", label: "Plot" },
  { id: "art", label: "Graphics" },
  { id: "characters", label: "Characters" },
  { id: "enjoyment", label: "Enjoyment" },
  { id: "fan-service", label: "Fan Service" },
];

export const RatingEditorContent = ({
  titleId,
  ratings,
  onChange,
  isSaving,
  onSave,
  onCancel,
  onTitleChange,
}: RatingEditorContentProps) => {
  const safeRatings: Rating = Object.keys(ratings).length === 0 ? {} : ratings;

  const customCategories = Object.keys(safeRatings).filter(
    (key) => key !== "overall",
  );
  const currentOverall = safeRatings.overall;
  const isOverallMissing = currentOverall === undefined;
  const showComparison = !isOverallMissing;

  const handleUpdateNumericValue = (key: string, val: number | undefined) => {
    onChange({
      ...safeRatings,
      [key]: val,
    } as Rating);
  };

  const calculateAverage = (): string => {
    const activeValues = customCategories
      .map((key) => safeRatings[key])
      .filter((val): val is number => typeof val === "number" && val > 0);

    if (activeValues.length === 0) return "0.0";

    const sum = activeValues.reduce((acc, current) => acc + current, 0);
    return (sum / activeValues.length).toFixed(1);
  };

  const avgRating = calculateAverage();

  const handleRenameCategory = (oldKey: string, newKey: string) => {
    if (!newKey || newKey === "overall" || safeRatings[newKey] !== undefined)
      return;

    const { [oldKey]: value, ...rest } = safeRatings;
    onChange({ ...rest, [newKey]: value } as Rating);
  };

  const handleAddCategory = () => {
    const newKey = `Criteria ${customCategories.length + 1}`;
    onChange({ ...safeRatings, [newKey]: 0 } as Rating);
  };

  const handleAddPreset = (label: string) => {
    if (safeRatings[label] !== undefined) return;
    onChange({ ...safeRatings, [label]: 0 } as Rating);
  };

  const handleDeleteCategory = (key: string) => {
    if (key === "overall") return;
    const { [key]: _, ...rest } = safeRatings;
    onChange(rest as Rating);
  };

  return (
    <div className="flex flex-col max-h-[75vh] sm:max-h-[70vh]">
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-6 sm:space-y-8 p-1 sm:p-2 custom-scrollbar">
        
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-background-muted/50 rounded-2xl border-2 border-primary/20 sticky top-0 z-10 backdrop-blur-md gap-3 sm:gap-0">
            <div className="flex items-center gap-3 text-primary">
              <StarRoundedIcon className="text-xl sm:text-2xl" />
              <div className="flex flex-col">
                <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest leading-none">
                  Overall Score
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">
                  Required to unlock criteria
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <div className="scale-90 sm:scale-110 origin-right w-full sm:w-auto flex justify-end">
                <CompactRate
                  currentRating={currentOverall}
                  onRate={(val) => handleUpdateNumericValue("overall", val)}
                  onClear={() => handleUpdateNumericValue("overall", undefined)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 px-2">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[10px] sm:text-[12px] font-black pl-2 uppercase text-muted-foreground tracking-[0.15em] sm:tracking-[0.2em] italic">
                Additional Criteria
              </h3>
              <Button
                onClick={handleAddCategory}
                className="h-7 sm:h-8 !text-xl sm:text-[11px] gap-1 sm:gap-2 px-3 sm:px-4 bg-transparent text-primary hover:bg-primary/20 rounded-xl font-bold transition-all"
                disabled={isOverallMissing}
              >
                <AddIcon sx={{ fontSize: { xs: 30, sm: 24 } }} />
                <span className="hidden xs:inline">Add Custom</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </div>

            {!isOverallMissing && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5 pt-1 items-center">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 mr-1 flex items-center gap-1">
                    <AutoAwesomeIcon sx={{ fontSize: 12 }} /> Presets:
                  </span>
                  {PRESET_CATEGORIES.map((preset) => {
                    const isAdded = safeRatings[preset.label] !== undefined;
                    return (
                      <Button
                        key={preset.id}
                        type="button"
                        disabled={isAdded}
                        onClick={() => handleAddPreset(preset.label)}
                        className={`text-[12px] px-2.5 py-1 rounded-lg font-bold border transition-all duration-200 ${
                          isAdded
                            ? "bg-transparent border-border text-muted-foreground/40 line-through cursor-not-allowed"
                            : "bg-background-muted hover:bg-primary/10 border-border hover:border-primary/30 text-foreground hover:text-primary active:scale-95"
                        }`}
                      >
                        {preset.label}
                      </Button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 px-2 py-1.5 bg-primary/5 rounded-xl border border-primary/10 w-fit">
                  <CalculateIcon className="text-foreground/60 text-sm sm:text-base " />
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Criteria Avg:
                  </span>
                  <span className="text-xs sm:text-sm font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {avgRating}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className={`flex flex-col gap-3 sm:gap-4 transition-all duration-300 ${
              isOverallMissing
                ? "grayscale opacity-30 pointer-events-none scale-[0.98]"
                : "opacity-100"
              }`}
          >
            {customCategories.length === 0 && !isOverallMissing && (
              <div className="text-center p-6 sm:p-8 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-xs sm:text-sm font-medium">
                No custom criteria added yet. Use presets or add custom ones above.
              </div>
            )}

            {customCategories.map((key) => (
              <CategoryRow
                key={key}
                categoryKey={key}
                value={safeRatings[key] ?? 0}
                titleId={titleId}
                showComparison={showComparison}
                onRename={handleRenameCategory}
                onDelete={handleDeleteCategory}
                onRate={(val) => handleUpdateNumericValue(key, val)}
                onClear={() => handleUpdateNumericValue(key, 0)}
                onTitleChange={onTitleChange}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 border-t border-border">
        <Button
          variant="outline"
          className="text-foreground bg-card border-none w-full sm:flex-1 h-12 sm:h-14 rounded-xl font-bold"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          className="w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Rating"}
        </Button>
      </div>
    </div>
  );
};