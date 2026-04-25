import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { type ReactNode } from "react";
import { useCollapsibleList } from '../hooks/useCallapsibleList';
import CollapsibleSectionSkeleton from './CollapsableSectionSceleton';

type CollapsibleSectionProps<T, K extends string | number> = {
    title: string|React.ReactNode;
    items: T[];
    getItemKey: (item: T) => K;
    renderItem: (item: T) => ReactNode;
    renderSceletonItem?: (key: number | string ) => ReactNode;
    isPending?: boolean;
    error?: unknown;
};

const defaultSceletonItem = (key: number | string ) => (
    <div key={key} className="w-full h-64 bg-card animate-pulse rounded-md"></div>
);
function CollapsibleSection<T, K extends string | number>({
    title,
    items,
    renderItem,
    getItemKey,
    isPending = false,
    error = null,
    renderSceletonItem = defaultSceletonItem,
}: CollapsibleSectionProps<T, K>) {

    const {
        isOpen,
        toggleOpen,
        alwaysVisibleItems,
        collapsibleItems,
    } = useCollapsibleList<T>({items});

    if (isPending) {
        return <CollapsibleSectionSkeleton title={title} renderItem={renderSceletonItem} />;
    };
    if (error) return <div className="p-10 text-danger">Error loading {title}.</div>;

    return (
        <div className="w-full px-2 md:px-8 lg:px-20">
            <div className="mt-10 border-b flex justify-between items-center px-2">
                <h3 className="text-2xl cursor-pointer" onClick={toggleOpen}>
                    {title}
                </h3>
                <button
                    onClick={toggleOpen}
                    className="p-1 rounded-full hover:bg-background-muted-hover transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                    aria-controls={`list-container-${title}`}
                    aria-label={isOpen ? "Collapse list" : "Expand list"}
                >
                    <ArrowDropDownRoundedIcon sx={{ fontSize: 40 }} className={`dropdown ${isOpen ? "open" : ""}`} />
                </button>
            </div>
            <div className="card-container">
                {alwaysVisibleItems.map((item) => (
                    <div key={getItemKey(item)}>
                        {renderItem(item)}
                    </div>
                ))}
                {isOpen ? collapsibleItems.map((item) => (
                    <div key={getItemKey(item)}>
                        {renderItem(item)}
                    </div>
                )) : null}
            </div>
        </div>
    );
};

export default CollapsibleSection;