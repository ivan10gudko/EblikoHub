import { useState } from "react";
import { useWindowDimensions } from "~/shared/hooks";
interface UseCollapsibleListProps<T>{
    items: T[];
}

export function useCollapsibleList<T>({items = []}: UseCollapsibleListProps<T>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const windowSize = useWindowDimensions();

    let itemsInFirstRow;
    if (windowSize == 'xs' || windowSize == 'sm') {
        itemsInFirstRow = 2;
    } else if (windowSize == 'md' || windowSize == 'lg') {
        itemsInFirstRow = 4;
    } else if (windowSize == 'xl') {
        itemsInFirstRow = 5;
    } else {
        itemsInFirstRow = 6;
    }

    const alwaysVisibleItems = items.slice(0, itemsInFirstRow) ?? [];
    const collapsibleItems = items.slice(itemsInFirstRow) ?? [];

    return {
        isOpen,
        alwaysVisibleItems,
        collapsibleItems,
        toggleOpen: () => setIsOpen(open => !open),
    };
}