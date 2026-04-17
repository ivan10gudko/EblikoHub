import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { titleRecordService, type TitleRecord } from "~/entities/titleRecord";
import { WatchlistRow } from "../WatchListRow/watchlistRow";
import { useParams, useSearchParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { useReorderWatchlist } from "~/entities/titleRecord/hooks/useReorderWatchlist";
import { useTitleFilterStore } from "~/features/titleFilter/store/titleFilter.store";
import { useMemo, useState } from "react";
import { Button } from "~/shared/ui/Button";
import { WatchlistSkeleton } from "./WatchlistTableSkeleton";
import AddTitleModal from "../AddTitleModal/addTitleModal";
interface WatchlistTableProps {
  titles: TitleRecord[];
  isLoading?: boolean;
  isOwn: boolean;
}
export const WatchlistTable = ({ titles, isLoading, isOwn }: WatchlistTableProps) => {
  const [searchParams] = useSearchParams();
  const { userId } = useParams<{ userId: string }>();
  const { search, sortBy, order, status } = useTitleFilterStore();
  const queryKey = useMemo(
    () => ['titles', userId, { search, sortBy, order, status }],
    [userId, search, sortBy, order, status]
  );

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

  if (titles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-500 font-medium mb-4">Watchlist is empty</p>
        {isOwn && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white px-6 py-2 rounded-xl transition-all"
          >
            <AddIcon />
            <span>Add your first title</span>
          </Button>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 w-full">

      {isOwn && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="
            group flex items-center justify-center gap-3 w-full py-3 
            bg-gray-50/50 hover:bg-amber-50 
            border-2 border-dashed border-gray-200 hover:border-amber-300 
            rounded-2xl transition-all duration-200 mb-2
          "
        >
          <div className="flex items-center justify-center w-8 h-8 bg-white group-hover:bg-amber-400 rounded-full shadow-sm transition-colors">
            <AddIcon className="text-black group-hover:text-white transition-colors" sx={{ fontSize: 20 }} />
          </div>
          <span className="font-bold text-black group-hover:text-amber-600 transition-colors">
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
                      <WatchlistRow
                        title={title}
                        isOwn={isOwn}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddTitleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};