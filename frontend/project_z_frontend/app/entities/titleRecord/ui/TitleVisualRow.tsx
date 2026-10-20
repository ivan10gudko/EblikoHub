import React from "react";
import { TitleTypeThemes, type TitleVisual } from "~/entities/titleRecord";
import { TitleHoverPreview } from "~/shared/ui/HoverPreviewImage";
import { Checkbox } from "~/shared/ui/CheckBox";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";

interface RoomTitleVisualRowProps {
    item: TitleVisual;
    isChecked: boolean;
    onToggle: (titleId: number) => void;
}

export const TitleVisualRow: React.FC<RoomTitleVisualRowProps> = ({
    item,
    isChecked,
    onToggle,
}) => {
    const themeClasses = item.titleType ? TitleTypeThemes[item.titleType] || "" : "";

    return (
        <div
            onClick={() => onToggle(item.titleId)}
            className={`flex items-center gap-3 bg-card/50 p-2.5 rounded-xl border transition-all cursor-pointer hover:border-primary/40 ${themeClasses} ${isChecked ? "border-primary/60 bg-primary/5" : "border-border/40"
                }`}
        >
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                <Checkbox
                    checked={isChecked}
                    onChange={() => onToggle(item.titleId)}
                />
            </div>

            <div className="relative h-10 w-16 shrink-0 cursor-pointer">
                <TitleHoverPreview
                    imageUrl={item.imageUrl || DEFAULT_IMAGE_PATH}
                    titleName={item.titleName}
                    className="h-full w-full rounded-lg object-cover bg-muted/20"
                />
            </div>

            <div className="flex-1 min-w-0">
                <span className="block font-bold text-foreground text-xs sm:text-sm tracking-wide truncate uppercase">
                    {item.titleName}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-medium">
                    {item.titleType}
                </span>
            </div>
        </div>
    );
};