import type { InfiniteData } from "@tanstack/react-query";



export const updateInfiniteQuery = <TPage, TItem>({
    oldData,
    getContent,
    setContent,
    updater
}: {
    oldData: InfiniteData<TPage> | undefined;
    getContent: (page: TPage) => TItem[];
    setContent: (page: TPage, newContent: TItem[]) => TPage;
    updater: (allItems: TItem[]) => TItem[];
}): InfiniteData<TPage> | undefined => {
    if (!oldData) return oldData;

    const allItems = oldData.pages.flatMap((p) => getContent(p));
    const pageSize = getContent(oldData.pages[0]).length || 10;

    const newContent = updater(allItems);

    return {
        ...oldData,
        pages: oldData.pages.map((page, i) =>
            setContent(page, newContent.slice(i * pageSize, (i + 1) * pageSize))
        ),
    };
};