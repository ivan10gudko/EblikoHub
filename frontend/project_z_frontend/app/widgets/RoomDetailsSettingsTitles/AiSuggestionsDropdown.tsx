import { useState, useMemo, useEffect } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { TitleVisualRow, type TitleVisual } from "~/entities/titleRecord";
import { Loader } from "~/shared/ui/Loader";

interface AiSuggestionsDropdownProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    suggestedTitles: TitleVisual[];
    isLoading: boolean;
    onConfirmSelection: (selectedIds: number[]) => void;
}

export const AiSuggestionsDropdown = ({
    isOpen,
    onOpenChange,
    suggestedTitles,
    isLoading,
    onConfirmSelection,
}: AiSuggestionsDropdownProps) => {
    const [selectedTitleIds, setSelectedTitleIds] = useState<Record<number, boolean>>({});

    const toggleSelect = (titleId: number) => {
        setSelectedTitleIds((prev) => ({
            ...prev,
            [titleId]: !prev[titleId],
        }));
    };

    useEffect(() => {
        if (!isOpen) {
            setSelectedTitleIds({});
        }
    }, [isOpen]);

    const isAllSelected = useMemo(() => {
        if (suggestedTitles.length === 0) return false;
        return suggestedTitles.every((item) => selectedTitleIds[item.titleId]);
    }, [suggestedTitles, selectedTitleIds]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedTitleIds({});
        } else {
            const allSelected: Record<number, boolean> = {};
            suggestedTitles.forEach((item) => {
                allSelected[item.titleId] = true;
            });
            setSelectedTitleIds(allSelected);
        }
    };

    const selectedCount = Object.values(selectedTitleIds).filter(Boolean).length;

    const handleConfirm = () => {
        const ids = Object.entries(selectedTitleIds)
            .filter(([_, isSelected]) => isSelected)
            .map(([id]) => Number(id));

        onConfirmSelection(ids);
        onOpenChange(false);
    };

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={onOpenChange}>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    className="h-10 px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-bold border border-primary/30 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                >
                    <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                    AI Suggestions
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-card border border-border rounded-2xl shadow-2xl p-3 outline-none animate-in fade-in zoom-in duration-150 flex flex-col gap-2 max-h-[380px] sm:max-h-[440px] overflow-hidden"
                >
                    <div className="flex items-center justify-between border-b border-border/60 pb-2 px-1">
                        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <AutoAwesomeIcon className="text-primary text-sm" /> Suggested Titles
                        </span>
                        <div className="flex items-center gap-2">
                            {suggestedTitles.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="text-[10px] font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
                                >
                                    {isAllSelected ? "Deselect All" : "Select All"}
                                </button>
                            )}
                            <span className="text-[10px] text-muted-foreground font-bold">
                                ({selectedCount})
                            </span>
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar min-h-[140px] py-1 flex flex-col items-center justify-center">
                        {isLoading ? (
                            <div className="py-8 flex items-center justify-center w-full">
                                <Loader />
                            </div>
                        ) : suggestedTitles.length === 0 ? (
                            <div className="text-center py-8 text-xs text-muted-foreground italic w-full">
                                No suggestions found.
                            </div>
                        ) : (
                            suggestedTitles.map((item: TitleVisual) => (
                                <div key={item.titleId} className="w-full">
                                    <TitleVisualRow
                                        item={item}
                                        isChecked={!!selectedTitleIds[item.titleId]}
                                        onToggle={toggleSelect}
                                    />
                                </div>
                            ))
                        )}
                    </div>

                    {suggestedTitles.length > 0 && (
                        <div className="pt-2 border-t border-border/60 flex justify-end">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={handleConfirm}
                                className="w-full h-10 bg-primary text-primary-foreground rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-98 cursor-pointer shadow-sm"
                            >
                                Confirm Selection ({selectedCount})
                            </button>
                        </div>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
};