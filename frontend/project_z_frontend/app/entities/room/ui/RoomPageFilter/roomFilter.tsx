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
                className="text-sm hover:bg-background-muted hover:text-danger-hover transition-colors font-medium p-0 h-auto"
            >
                Reset all filters
            </Button>
        </div>
    );
};