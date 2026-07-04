import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";
import { WatchlistRowShort } from "./WatchlistRowShort";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";

interface WatchlistMicroListProps {
  userId: string;
  roomId: number;
  isWatchlistModeToggled: boolean;
}

export const WatchlistShortTitles = ({ userId, roomId, isWatchlistModeToggled }: WatchlistMicroListProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinityTitles(userId, { limit: 10 }, {
      noLinksToRoom: isWatchlistModeToggled,
      roomId,
    });

  if (status === 'pending') return <div className="p-4 text-sm">Loading...</div>;
  if (status === 'error') return <div className="p-4 text-sm text-danger">Error!</div>;

  return (
    <div className="flex flex-col gap-2 w-full bg-background-muted/10 rounded-xl p-2 h-[600px] overflow-y-auto hide-scrollbar">
      <Droppable
        droppableId={`watchlist-${userId}`}
        isDropDisabled={true}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-1"
          >
            {data?.pages.map((page, pageIndex) =>
              page.content.map((title, titleIndex) => {
                const absoluteIndex = pageIndex * 10 + titleIndex;

                return (
                  <Draggable
                    key={String(title.titleId)}
                    draggableId={String(title.titleId)}
                    index={absoluteIndex}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          width: snapshot.isDragging ? "100%" : "100%",
                          maxWidth: snapshot.isDragging ? "600px" : "100%",
                          boxSizing: "border-box",
                        } as React.CSSProperties}
                        className={`flex items-center justify-between group ${snapshot.isDragging ? "bg-card shadow-xl border border-primary/50" : ""}`}
                      >
                        <WatchlistRowShort
                          title={title}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="py-10 flex justify-center">
        <InfiniteScrollLoader
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};