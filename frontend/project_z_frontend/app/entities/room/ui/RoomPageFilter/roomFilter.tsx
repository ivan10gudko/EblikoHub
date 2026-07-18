import { Divider } from '@mui/material';
import { Button } from "~/shared/ui/Button";
import { useRoomFilterStore } from '../../store/rooms.store';
import { RoomSearch } from './roomSearch';
import { RoomSort } from './sortControl';


export const RoomFilters = () => {
    const { reset } = useRoomFilterStore();

    return (
        <div className="flex flex-col gap-10 p-4 bg-background rounded-2xl shadow-sm border border-border">
            <RoomSearch />
            <RoomSort />
            
            <Divider sx={{ my: 1 }} />
            
            <Button 
                onClick={reset}
                variant="outline"
                className="w-full border  border-danger/40 text-white/70 hover:bg-danger/15 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/30 "
            >
                Reset all filters
            </Button>
        </div>
    );
};