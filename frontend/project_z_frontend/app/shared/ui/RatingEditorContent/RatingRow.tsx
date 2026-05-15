import { useEffect, useState } from "react";
import { Button } from "../Button";
import { CompactRate } from "../CompactRate";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const CategoryRow = ({
    categoryKey,
    value,
    onRename,
    onDelete,
    onRate,
    onClear
}: {
    categoryKey: string,
    value: number,
    onRename: (oldKey: string, newKey: string) => void,
    onDelete: (key: string) => void,
    onRate: (val: number) => void,
    onClear: () => void
}) => {
    const [localName, setLocalName] = useState(categoryKey);

    useEffect(() => {
        setLocalName(categoryKey);
    }, [categoryKey]);

    return (
        <div className="group flex items-center gap-2 sm:gap-4 bg-card p-2 sm:p-3 pl-3 sm:pl-4 rounded-2xl border-2 border-border/60 hover:border-primary/40 transition-all shadow-sm">
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
                    className="h-9 sm:h-10 w-full text-xs sm:text-sm border-none bg-transparent p-0 focus:ring-0 font-bold truncate placeholder:opacity-50 outline-none"
                />
            </div>

            <div className="shrink-0 scale-[0.8] sm:scale-100 origin-right">
                <CompactRate
                    currentRating={value || undefined}
                    onRate={onRate}
                    onClear={onClear}
                />
            </div>
        </div>
    );
};