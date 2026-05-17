import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "~/shared/ui/Button";
import { CompactRate } from "../CompactRate";
import type { Rating } from "~/shared/types";
import { CategoryRow } from "./RatingRow";

interface RatingEditorContentProps {
    ratings: Rating;
    onChange: (newRatings: Rating) => void;
    isSaving: boolean;
    onSave: () => void;
    onCancel: () => void;
}

export const RatingEditorContent = ({
    ratings,
    onChange,
    isSaving,
    onSave,
    onCancel
}: RatingEditorContentProps) => {

    const safeRatings: { overall: number;[key: string]: number } =
        (Object.keys(ratings).length === 0)
            ? { overall: 0 }
            : ratings as { overall: number;[key: string]: number };
    const customCategories = Object.keys(safeRatings).filter((key) => key !== "overall");
    const currentOverall = safeRatings.overall || 0;
    const isOverallMissing = currentOverall === 0;

    const handleUpdateNumericValue = (key: string, val: number | undefined) => {
        onChange({
            ...safeRatings,
            [key]: val ?? 0,
        } as Rating);
    };

    const handleRenameCategory = (oldKey: string, newKey: string) => {
        if (!newKey || newKey === "overall" || safeRatings[newKey] !== undefined) return;

        const { [oldKey]: value, ...rest } = safeRatings;
        onChange({ ...rest, [newKey]: value } as Rating);
    };

    const handleAddCategory = () => {
        const newKey = `Criteria ${customCategories.length + 1}`;
        onChange({ ...safeRatings, [newKey]: 0 } as Rating);
    };

    const handleDeleteCategory = (key: string) => {
        if (key === "overall") return;
        const newState = { ...safeRatings };
        delete (newState as any)[key];
        onChange(newState as Rating);
    };
    return (
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
                            <CategoryRow
                                key={key}
                                categoryKey={key}
                                value={safeRatings[key]}
                                onRename={handleRenameCategory}
                                onDelete={handleDeleteCategory}
                                onRate={(val) => handleUpdateNumericValue(key, val)}
                                onClear={() => handleUpdateNumericValue(key, 0)}
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
                    disabled={isOverallMissing || isSaving}
                    className="w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
                    onClick={onSave}
                >
                    {isSaving ? "Saving..." : "Save Rating"}
                </Button>
            </div>
        </div>
    );
};