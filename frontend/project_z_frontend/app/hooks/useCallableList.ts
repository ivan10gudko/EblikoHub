
import { useQuery, type QueryKey, type QueryFunction } from "@tanstack/react-query";
import { useState } from "react";
import useWindowDimensions from "~/utils/useWindowDimensions";

type UseCollapsibleListProps<T> = {
    queryKey: QueryKey;
    queryFn: QueryFunction<T[]>;
};

export function useCollapsibleList<T>({ queryKey, queryFn }: UseCollapsibleListProps<T>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const windowSize = useWindowDimensions();

    const { data, isPending, error } = useQuery<T[]>({
        queryKey: queryKey,
        queryFn: queryFn
    });

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

    const alwaysVisibleItems = data?.slice(0, itemsInFirstRow) ?? [];
    const collapsibleItems = data?.slice(itemsInFirstRow) ?? [];

    return {
        isOpen,
        isPending,
        error,
        alwaysVisibleItems,
        collapsibleItems,
        toggleOpen: () => setIsOpen(open => !open),
    };
}