import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { type TitleRecord } from "~/entities/titleRecord";
import { WatchlistRow } from "../WatchListRow/watchlistRow";
import { useParams, useSearchParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { useReorderWatchlist } from "~/entities/titleRecord/hooks/useReorderWatchlist";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useMemo, useState } from "react";
import { Button } from "~/shared/ui/Button";
import { WatchlistSkeleton } from "./WatchlistTableSkeleton";
import { AddTitleModal } from "../TitleModal";
interface WatchlistTableProps {
  titles: TitleRecord[];
  isLoading?: boolean;
  isOwn: boolean;
  queryKey:unknown[];
}
export const WatchlistTable = ({ titles, isLoading, isOwn, queryKey }: WatchlistTableProps) => {
  const [searchParams] = useSearchParams();
  const { userId } = useParams<{ userId: string }>();
  const { search, sortBy, order, status } = useTitleFilterStore();
  

  const isCustomOrder = searchParams.get("sortBy") === "customOrder";
  const isFiltered = !!searchParams.get("search") || !!searchParams.get("status");
  const isDragable = isCustomOrder && !isFiltered;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { reorder, optimisticTitles } = useReorderWatchlist(titles, queryKey, userId);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorder(source.index, destination.index);
  };

  if (isLoading) return <WatchlistSkeleton />;

  return (
    <div className="flex flex-col gap-2 w-full">
      {titles.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-background-muted rounded-3xl border-2 border-dashed border-border">
          <p className="text-foreground font-medium mb-4">Watchlist is empty</p>
          {isOwn && (
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-foreground px-6 py-2 rounded-xl transition-all"
            >
              <AddIcon />
              <span>Add your first title</span>
            </Button>
          )}
        </div>
      ) : (
        <>
          {isOwn && (
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center justify-center gap-3 w-full py-3 bg-background-muted hover:bg-background-muted-hover border-2 border-dashed border-border hover:border-primary rounded-2xl transition-all duration-200 mb-2"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-background group-hover:bg-primary-hover rounded-full shadow-sm transition-colors">
                <AddIcon className="text-foreground group-hover:text-background transition-colors" sx={{ fontSize: 20 }} />
              </div>
              <span className="font-bold text-foreground group-hover:text-primary-hover transition-colors">
                Add new title
              </span>
            </Button>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="watchlist">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-col gap-2 w-full"
                >
                  {optimisticTitles.map((title, index) => (
                    <Draggable
                      key={String(title.titleId)}
                      draggableId={String(title.titleId)}
                      index={index}
                      isDragDisabled={!isDragable}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={!isDragable ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
                        >
                          <WatchlistRow title={title} isOwn={isOwn} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      )}
      <AddTitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};