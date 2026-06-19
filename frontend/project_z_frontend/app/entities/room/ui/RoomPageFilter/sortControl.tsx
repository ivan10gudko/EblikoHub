import { Select } from "~/shared/ui/Select";
import { Button } from "~/shared/ui/Button";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRoomFilterStore, type RoomSortType } from "../../store/rooms.store";


const sortOptions = [
    { label: "Name", value: "roomName" },
    { label: "Date Created", value: "createdAt" },
    { label: "Members", value: "memberCount" },
];

export const RoomSort = () => {
    const { sortBy, order, setSort, toggleOrder } = useRoomFilterStore();

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-foreground uppercase px-1">Sort by</label>
            <div className="flex gap-2">
                <Select
                    value={sortBy}
                    options={sortOptions}
                    onChange={(val) => setSort(val as RoomSortType)}
                    className="flex-1"
                />
                <Button 
                    variant="outline" 
                    onClick={toggleOrder} 
                    className="px-4 bg-background hover:bg-background-muted-hover rounded-xl transition-colors"
                >
                    {order === "asc" ? (
                        <KeyboardArrowUpIcon className="text-primary hover:text-primary-hover" sx={{ fontSize: 24 }} />
                    ) : (
                        <KeyboardArrowDownIcon className="text-primary hover:text-primary-hover" sx={{ fontSize: 24 }} />
                    )}
                </Button>
            </div>
        </div>
    );
};