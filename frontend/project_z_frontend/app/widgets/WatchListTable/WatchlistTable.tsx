import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { WatchlistRow } from "../WatchListRow/watchlistRow";
import { useParams, useSearchParams } from "react-router";
import { calculateNewOrder } from "~/shared/helpers";
import { queryClient } from "~/shared/lib";
import { useReorderWatchlist } from "~/entities/titleRecord/hooks/useReorderWatchlist";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
interface WatchlistTableProps {
  titles: TitleRecord[];
  isLoading?: boolean;
}

export const WatchlistTable = ({ titles, isLoading }: WatchlistTableProps) => {
  const [searchParams] = useSearchParams();
  const { userId } = useParams<{ userId: string }>();
  const { search, sortBy, order, status } = useTitleFilterStore();
  const queryKey = ['titles', userId, { search, sortBy, order, status }];


  const isCustomOrder = searchParams.get("sortBy") === "customOrder";
  const isFiltered = !!searchParams.get("search") || !!searchParams.get("status");
  const isDragable = isCustomOrder && !isFiltered;

  const { reorder } = useReorderWatchlist(titles, queryKey);
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    if (!destination || source.index === destination.index) return;
    if (!isCustomOrder) {
      toast.error("Drag and drop available only with custom sort");
      return;
    }

    reorder(source.index, destination.index);
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="watchlist">
        {(provided) => (
          <div 
            {...provided.droppableProps} 
            ref={provided.innerRef} 
            className="flex flex-col gap-2 w-full"
          >
            {titles.map((title, index) => (
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
                    <WatchlistRow title={title} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};