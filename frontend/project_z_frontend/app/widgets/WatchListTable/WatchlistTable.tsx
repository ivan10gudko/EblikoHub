import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { type TitleRecord } from "~/entities/titleRecord";
import { WatchlistRow } from "./WatchlistRow/watchlistRow";
import { useParams, useSearchParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import { useReorderWatchlist } from "~/entities/titleRecord/hooks/useReorderWatchlist";
import { useMemo, useState } from "react";
import { Button } from "~/shared/ui/Button";
import { WatchlistSkeleton } from "./WatchlistTableSkeleton";
import { AddTitleModal } from "../TitleModal";
import { PinnedWatchlistRow } from "./WatchlistRow/pinnedWatchlistRow";
import { PinnedWatchlistRowReadOnly } from "./WatchlistRow/pinnedWatchlistRowReadOnly";
import { WatchlistRowReadOnly } from "./WatchlistRow/WatchlistRowReadOnly";
import { AddNewButton } from "~/shared/ui/AddNewButton";

interface WatchlistTableProps {
  titles: TitleRecord[];
  isLoading?: boolean;
  isOwn: boolean;
  queryKey: unknown[];
}

export const WatchlistTable = ({ titles, isLoading, isOwn, queryKey }: WatchlistTableProps) => {
  const [searchParams] = useSearchParams();
  const { userId } = useParams<{ userId: string }>();

  const isCustomOrder = searchParams.get("sortBy") === "customOrder";
  const isFiltered = !!searchParams.get("search") || !!searchParams.get("status");
  const isDragable = isCustomOrder && !isFiltered;
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const showNumber = !isDragable;

  const { reorder, optimisticTitles } = useReorderWatchlist(titles, queryKey, userId);

  const { pinnedTitle, regularTitles } = useMemo(() => {
    const pinned = optimisticTitles.find((t) => t.pinned);
    const regular = optimisticTitles.filter((t) => !t.pinned);
    return { pinnedTitle: pinned, regularTitles: regular };
  }, [optimisticTitles]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorder(source.index, destination.index);
  };

  if (isLoading) return <WatchlistSkeleton />;

  if (titles.length === 0) {
    return (
      <AddNewButton onClick={() => setIsModalOpen(true)} placeholder="title" />
    );
  }

 
  if (!isOwn) {
    return (
      <div className="flex flex-col gap-2 w-full">
        {pinnedTitle && <PinnedWatchlistRowReadOnly title={pinnedTitle} />}

        <div className="flex flex-col gap-2 w-full">
          {regularTitles.map((title, index) => (
            <WatchlistRowReadOnly 
              key={String(title.titleId)} 
              title={title} 
              index={index}
              showNumber={showNumber}
            />
          ))}
        </div>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-2 w-full">
      <AddNewButton onClick={() => setIsModalOpen(true)} placeholder="title" />

      {pinnedTitle && <PinnedWatchlistRow title={pinnedTitle} />}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="watchlist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2 w-full"
            >
              {regularTitles.map((title, index) => (
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
                      style={provided.draggableProps.style as React.CSSProperties} // <- ТУТ ВИПРАВЛЕНО ЕРОР
                      className="w-full"
                    >
                      <WatchlistRow
                        title={title}
                        index={index}
                        showNumber={showNumber}
                        dragHandleProps={isDragable ? provided.dragHandleProps : undefined}
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

      <AddTitleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};