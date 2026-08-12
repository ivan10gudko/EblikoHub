import React from "react";

import { Button } from "~/shared/ui/Button";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { RoomDetailsSortVariants, roomSortOptions } from '~/entities/room';
import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
import { Select } from "~/shared/ui/Select";

export const RoomDetailsSortControl = () => {
    const { sortBy, setSort, order, toggleOrder } = useRoomDetailsFilterStore();

    return (
        <div className="flex flex-col gap-2">
         
            <label className="text-[13px] uppercase font-bold text-muted-foreground">
                Sort By
            </label>
            
            <div className="flex gap-2 items-center w-full">
              
                <div className="flex-1 min-w-0">
                    <Select
                        value={sortBy}
                        options={roomSortOptions}
                        onChange={(val) => setSort(val as RoomDetailsSortVariants)} 
                        className="w-full"
                    />
                </div>
                
             
                <Button
                    variant="outline"
                    onClick={toggleOrder}
                    className="w-10 h-10 px-0 bg-background hover:bg-background-muted-hover rounded-lg transition-colors border-border flex items-center justify-center shrink-0"
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