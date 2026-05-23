import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "../../../shared/ui/Button";
import { CompactRate } from "../../../shared/ui/CompactRate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { RatingNeighborsContent } from "./RatingNeighbours";


export const CategoryRow = ({
    categoryKey,
    value,
    titleId,
    showComparison,
    onRename,
    onDelete,
    onRate,
    onClear
}: {
    categoryKey: string;
    value: number;
    titleId: number;
    showComparison: boolean;
    onRename: (oldKey: string, newKey: string) => void;
    onDelete: (key: string) => void;
    onRate: (val: number) => void;
    onClear: () => void;
}) => {
    const [localName, setLocalName] = useState(categoryKey);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        setLocalName(categoryKey);
    }, [categoryKey]);

    const handleRateAndTriggerComparison = (val: number) => {
        onRate(val);
        if (showComparison) {
            setIsPopoverOpen(true);
        }
    };

    return (
        <div className="group flex items-center gap-2 sm:gap-4 bg-card p-2 sm:p-3 pl-3 sm:pl-4 rounded-2xl border-2 border-border/60 hover:border-primary/40 transition-all shadow-sm relative">
            <Button
                variant="outline"
                onClick={() => onDelete(categoryKey)}
                className="h-9 w-9 sm:h-10 sm:w-10 p-0 text-foreground bg-danger hover:bg-danger-hover shrink-0 border-none rounded-xl flex items-center justify-center transition-transform active:scale-90"
            >
                <DeleteOutlineIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            </Button>

            <div className="flex-1 min-w-0">
                <input
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={() => onRename(categoryKey, localName)}
                    className="h-9 sm:h-10 w-full text-xs sm:text-sm bg-transparent p-0 border border-transparent focus:border-foreground/80 transition-colors font-bold truncate placeholder:opacity-50 outline-none"
                />
            </div>

            <div className="flex items-center gap-2 shrink-0 scale-[0.8] sm:scale-100 origin-right">
                
                <DropdownMenu.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <DropdownMenu.Trigger asChild>
                        <button
                            type="button"
                            className={`p-1.5 rounded-lg border transition-all ${
                                !showComparison ? "hidden" : "flex"
                            } ${
                                isPopoverOpen
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-background-muted border-border text-muted-foreground hover:text-foreground"
                            }`}
                            title="Show Live Comparison"
                        >
                            <CompareArrowsIcon sx={{ fontSize: 16 }} />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content
                            align="end"
                            side="bottom"
                            sideOffset={8}
                            className="z-[9999] outline-none animate-in fade-in zoom-in duration-150"
                            onInteractOutside={(e) => {
                            }}
                        >
                            <RatingNeighborsContent
                                titleId={titleId}
                                category={categoryKey}
                                ratingValue={value} 
                                onClose={() => setIsPopoverOpen(false)}
                            />
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <CompactRate
                    currentRating={value || undefined}
                    onRate={onRate} 
                    onClear={() => {
                        onClear();
                        setIsPopoverOpen(false);
                    }}
                />
            </div>
        </div>
    );
};