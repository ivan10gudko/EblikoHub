import { Select } from "~/shared/ui/Select"; 
import { Button } from "~/shared/ui/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RoomDetailsSortVariants, roomSortOptions } from '~/entities/room';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
export const RoomDetailsSortControl = () => {
    const { sortBy, setSort, order, toggleOrder } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-[13px] uppercase font-bold text-muted-foreground">
                Sort By
            </label>
            <div className="flex gap-2">
                <Select
                    value={sortBy}
                    options={roomSortOptions}
                    onChange={(val) => setSort(val as RoomDetailsSortVariants)} 
                    className="flex-1"
                />
                <Button
                    variant="outline"
                    onClick={toggleOrder}
                    className="w-10 px-0 bg-background hover:bg-background-muted-hover rounded-lg transition-colors border-border"
                >
                    {order === "asc" ? (
                        <KeyboardArrowUpIcon className="text-foreground" fontSize="small" />
                    ) : (
                        <KeyboardArrowDownIcon className="text-foreground" fontSize="small" />
                    )}
                </Button>
            </div>
        </div>
    );
};