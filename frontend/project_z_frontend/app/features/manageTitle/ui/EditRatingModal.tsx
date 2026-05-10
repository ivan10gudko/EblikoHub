import { useEffect, useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { CompactRate, type TitleRating, type TitleRecord, useTitleRecordMutation } from "~/entities/titleRecord";

interface EditRatingModalProps {
  title: TitleRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const EditRatingModal = ({ title, isOpen, onClose }: EditRatingModalProps) => {
  const { rate, rateLoading } = useTitleRecordMutation(
    title.apiTitleId,
    {
      apiTitleId: title.apiTitleId,
      titleName: title.titleName,
      status: title.status,
      rating: title.rating,
      imageUrl: title.imageUrl,
    },
    title
  );

  const [ratings, setRatings] = useState<TitleRating>(
    title.rating && "overall" in title.rating ? title.rating : { overall: 0 }
  );
  useEffect(() => {
    if (title.rating) {
      setRatings(title.rating);
    }
  }, [title.rating]);

  const customCategories = Object.keys(ratings).filter((key) => key !== "overall");

  const handleUpdateNumericValue = (key: string, val: number | undefined) => {
    setRatings((prev) => ({
      ...prev,
      [key]: val ?? 0,
    } as TitleRating));
  };

  const handleRenameCategory = (oldKey: string, newKey: string) => {
    if (!newKey || newKey === "overall" || ratings[newKey] !== undefined) return;
    setRatings((prev) => {
      const { [oldKey]: value, ...rest } = prev as Record<string, number>;
      return { ...rest, [newKey]: value } as TitleRating;
    });
  };

  const handleAddCategory = () => {
    const newKey = `Criteria ${customCategories.length + 1}`;
    setRatings((prev) => ({ ...prev, [newKey]: 0 } as TitleRating));
  };

  const handleDeleteCategory = (key: string) => {
    setRatings((prev) => {
      const newState = { ...prev } as Record<string, number>;
      delete newState[key];
      return newState as TitleRating;
    });
  };

  const handleCommit = () => {
    rate(ratings);
    onClose();
  };

  const currentOverall = ratings.overall || 0;
  const isOverallMissing = currentOverall === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Rating System"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col max-h-[75vh] sm:max-h-[70vh]">
        <div
          className="flex-1 overflow-y-auto pr-1 sm:pr-3 space-y-6 sm:space-y-8 p-1 sm:p-2 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--background-muted) transparent',
          }}
        >
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-background-muted/50 rounded-2xl border-2 border-primary/20 sticky top-0 z-10 backdrop-blur-md gap-3 sm:gap-0">
              <div className="flex items-center gap-3 text-primary">
                <StarRoundedIcon className="text-xl sm:text-2xl" />
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-[12px] font-black uppercase tracking-widest leading-none">Overall Score</span>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold">Required to unlock criteria</span>
                </div>
              </div>

              <div className="scale-90 sm:scale-110 origin-left sm:origin-right w-full sm:w-auto flex justify-end">
                <CompactRate
                  currentRating={currentOverall || undefined}
                  onRate={(val) => handleUpdateNumericValue("overall", val)}
                  onClear={() => handleUpdateNumericValue("overall", 0)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] sm:text-[12px] font-black uppercase text-muted-foreground tracking-[0.15em] sm:tracking-[0.2em] italic">
                Additional Criteria
              </h3>
              <Button
                variant="text-only"
                onClick={handleAddCategory}
                className="h-7 sm:h-8 text-[10px] sm:text-[11px] gap-1 sm:gap-2 px-3 sm:px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold transition-all"
                disabled={isOverallMissing}
              >
                <AddIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
                <span className="hidden xs:inline">Add New</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </div>

            <div className={`flex flex-col gap-3 sm:gap-4 transition-all duration-300 ${isOverallMissing ? "grayscale opacity-30 pointer-events-none scale-[0.98]" : "opacity-100"}`}>
              {customCategories.length === 0 && !isOverallMissing && (
                <div className="text-center p-6 sm:p-8 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-xs sm:text-sm font-medium">
                  No custom criteria added yet.
                </div>
              )}

              {customCategories.map((key) => (
                <div key={key} className="group flex items-center gap-2 sm:gap-4 bg-card p-2 sm:p-3 pl-3 sm:pl-4 rounded-2xl border-2 border-border/60 hover:border-primary/40 transition-all shadow-sm">
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteCategory(key)}
                    className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-white bg-danger hover:bg-danger-hover shrink-0 border-none rounded-xl flex items-center justify-center transition-transform active:scale-90"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </Button>

                  <div className="flex-1 min-w-0">
                    <Input
                      value={key}
                      onBlur={(newVal: string) => handleRenameCategory(key, newVal)}
                      onChange={() => { }}
                      className="h-9 sm:h-10 text-xs sm:text-sm border-none bg-transparent p-0 focus-visible:ring-0 font-bold truncate placeholder:opacity-50"
                    />
                  </div>

                  <div className="shrink-0 scale-[0.8] sm:scale-100 origin-right">
                    <CompactRate
                      currentRating={ratings[key] || undefined}
                      onRate={(val) => handleUpdateNumericValue(key, val)}
                      onClear={() => handleUpdateNumericValue(key, 0)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 mt-4 border-t border-border">
          <Button
            variant="outline"
            className="text-foreground bg-card border-none w-full sm:flex-1 h-12 sm:h-14 rounded-xl font-bold"
            onClick={onClose}
            disabled={rateLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={isOverallMissing || rateLoading}
            className="w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
            onClick={handleCommit}
          >
            {rateLoading ? "Saving..." : "Save Rating"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};