import { Droppable } from "@hello-pangea/dnd";
import { RoomTitleReadOnlyRowShort } from "./RoomTitleReadOnlyRow";
import type { RoomTitleWithUserLinks } from "~/features/manageRooms";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";

export interface RoomTitleReadOnlyListProps {
    titles: RoomTitleWithUserLinks[];
    isLoading: boolean;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    draggingTitleId: string;
    isFetchingNextPage: boolean;
}

export const RoomTitleReadOnlyList = ({
    titles,
    isLoading,
    fetchNextPage,
    hasNextPage,
    draggingTitleId,
    isFetchingNextPage
}: RoomTitleReadOnlyListProps) => {
    if (isLoading && titles.length === 0) return <div className="p-4 text-sm">Loading...</div>;

    return (
        <div className="flex flex-col gap-2 w-full p-2 h-[600px] overflow-y-auto hide-scrollbar bg-background-muted/10 rounded-xl">
            {titles.length === 0 && !isLoading ? (
                <div className="text-sm text-muted-foreground p-4 text-center">No room titles yet</div>
            ) : (
                titles.map((title) => {
                    const isAlreadyLinked = title.links.some(
                        link => String(link.title.titleId) === String(draggingTitleId)
                    );

                    return (
                        <Droppable
                            key={title.id}
                            droppableId={`room-title-${title.id}`}
                            isDropDisabled={isAlreadyLinked}
                        >
                            {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps} className="h-[60px] flex-shrink-0">
                                    <div className={`relative transition-all duration-200 ease-in-out ${snapshot.isDraggingOver && !isAlreadyLinked
                                        ? "scale-[1.02] ring-2 ring-primary rounded-2xl z-20 shadow-xl"
                                        : "scale-100"
                                        }`}>
                                        <RoomTitleReadOnlyRowShort title={title} />

                                        {isAlreadyLinked && draggingTitleId && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-danger/10 rounded-xl z-10 pointer-events-none">
                                                <span className="text-danger font-bold text-xs uppercase">Already linked</span>
                                            </div>
                                        )}

                                        {!isAlreadyLinked && snapshot.isDraggingOver && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-xl z-10 pointer-events-none">
                                                <span className="text-primary font-bold text-xl">+ Add</span>
                                            </div>
                                        )}
                                    </div>
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    )
                })
            )}

            {titles.length > 0 && (
                <div className="py-6 flex justify-center">
                    <InfiniteScrollLoader
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                </div>
            )}
        </div>
    );
};
