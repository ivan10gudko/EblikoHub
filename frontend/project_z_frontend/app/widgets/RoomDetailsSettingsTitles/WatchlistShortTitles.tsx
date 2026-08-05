import { Droppable, Draggable } from "@hello-pangea/dnd";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";
import { WatchlistRowShort } from "./WatchlistRowShort";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";


interface WatchlistMicroListProps {
  userId: string;
  roomId: number;
  isWatchlistModeToggled: boolean;
}

export const WatchlistShortTitles = ({
  userId,
  roomId,
  isWatchlistModeToggled,
}: WatchlistMicroListProps) => {
 
  const { search, sortBy, order, status: statusFilter, types } = useTitleFilterStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfinityTitles(
      userId,
      {
        limit: 10,
        search,
        sortBy,
        order,
        status: statusFilter,
        types: types.length > 0 ? types : undefined,
      },
      {
        noLinksToRoom: isWatchlistModeToggled,
        roomId,
      }
    );

  if (status === "pending")
    return <div className="p-4 text-sm text-foreground-muted">Loading...</div>;
  if (status === "error")
    return <div className="p-4 text-sm text-danger">Error loading titles!</div>;

  return (
    <div className="flex flex-col gap-2 w-full bg-background-muted/10 rounded-xl p-2 h-[600px] overflow-y-auto hide-scrollbar">
      <Droppable droppableId={`watchlist-${userId}`} isDropDisabled={true}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-1 w-full"
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
                          ...(snapshot.isDragging && {
                            width: "460px",
                          }),
                        }}
                        className={`flex items-center justify-between group rounded-lg ${
                          snapshot.isDragging
                            ? "bg-card shadow-xl border border-primary/50 z-50"
                            : ""
                        }`}
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