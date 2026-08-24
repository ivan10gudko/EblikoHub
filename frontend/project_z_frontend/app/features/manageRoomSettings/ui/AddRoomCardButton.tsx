import AddIcon from "@mui/icons-material/Add";
import { useRoomModal } from "~/features/manageRoomSettings/hooks/useRoomModal";

export const AddRoomCardButton = () => {
  const { openRoomModal } = useRoomModal();

  return (
    <button
      type="button"
      onClick={() => openRoomModal("add")}
      className="group flex flex-col items-center justify-center gap-2 w-full md:w-75 aspect-square min-h-[200px] max-h-[275px] bg-background-muted hover:bg-background-muted-hover border-2 border-dashed border-border hover:border-primary rounded-2xl transition-all duration-200 cursor-pointer p-4"
    >
      <div className="flex items-center justify-center w-9 h-9 bg-background group-hover:bg-primary rounded-full shadow-sm transition-colors">
        <AddIcon
          className="text-primary group-hover:text-background transition-colors"
          sx={{ fontSize: 20 }}
        />
      </div>
      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
        Add New Room
      </span>
    </button>
  );
};