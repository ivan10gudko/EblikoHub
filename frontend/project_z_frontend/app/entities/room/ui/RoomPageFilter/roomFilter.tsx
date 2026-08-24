import { Divider } from "@mui/material";
import { Button } from "~/shared/ui/Button";
import { useRoomFilterStore } from "../../store/rooms.store";
import { RoomSearch } from "./roomSearch";
import { RoomSort } from "./sortControl";
import type { ReactNode } from "react";


interface RoomFiltersProps {
  children?: ReactNode;
}

export const RoomFilters = ({ children }: RoomFiltersProps) => {
  const { reset } = useRoomFilterStore();

  return (
    <div className="flex flex-col gap-6 p-4 bg-background/60 rounded-2xl shadow-sm border border-border">
      <RoomSearch />
      <RoomSort />

      <Divider sx={{ my: 1 }} />

      <Button
        onClick={reset}
        variant="resetFilters"
      >
        Reset all filters
      </Button>

     <div className="h-px bg-border/80 my-0" />

      {children && <div className="flex flex-col  gap-3 pt-2">{children}</div>}
    </div>
  );
};
