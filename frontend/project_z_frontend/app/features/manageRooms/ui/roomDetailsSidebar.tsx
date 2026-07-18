import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Button } from '~/shared/ui/Button';
import { Sidebar } from '~/shared/ui/Sidebar';
import { type Room } from "~/entities/room/model/room.types";
import { RoomMembersList } from './roomMemberList';
import { Link } from 'react-router';
import { RoomDetailsSortControl } from './RoomDetailsFiltersModules/RoomDetailsSortControl';
import { RoomDetailsTypeFilter } from './RoomDetailsFiltersModules/RoomDetailsTypeFilter';
import { RoomDetailsStatusFilter } from './RoomDetailsFiltersModules/RoomDetailsStatusFilter';
import { RoomDetailsMemberFilter } from './RoomDetailsFiltersModules/RoomDetailsMembersFilter';
import { useRoomDetailsFilterStore } from '../store/roomDetailsFilter.store';

interface RoomDetailsSidebarProps {
  room: Room;
}

export const RoomDetailsSidebar = ({ room }: RoomDetailsSidebarProps) => {
  const { reset } = useRoomDetailsFilterStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <Sidebar className="w-80 bg-background p-5 rounded-3xl border border-border h-fit shadow-sm">
      
      <div className="flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto hide-scrollbar pb-6">

     
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-primary text-xl leading-tight font-bold">{room.roomName}</h2>
            </div>
          </div>
          <Link to={`/rooms/${room.roomId}/settings`}>
            <SettingsIcon className=" !transition-all !duration-300 text-muted-foreground - hover:text-primary   cursor-pointer hover:scale-130" />
          </Link>
        </div>

        <RoomMembersList members={room.members} />

        
        <div className="border-t border-border pt-4 flex flex-col gap-4">
          
          
          <button 
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="text-sm p-0.5 font-bold flex items-center justify-between rounded-lg  border border-border w-full text-foreground hover:text-primary transition-colors cursor-pointer text-left "
          >
            <span className="flex items-center gap-2 rounded-lg  px-2 py-1 text-primary/90 transition-colors hover:text-primary/60">
              <FilterListIcon className="text-ms" /> Group Filters             
            </span>
            {isFiltersOpen ? (
              <KeyboardArrowUpIcon fontSize="small" className="text-foreground" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" className="text-foreground" />
            )}
          </button>

          
          {isFiltersOpen && (
            <div className="flex flex-col gap-5 animate-fadeIn">
              <RoomDetailsTypeFilter />
              <RoomDetailsStatusFilter />
            </div>
          )}

         
          <div className="flex flex-col gap-5">
            <RoomDetailsMemberFilter members={room.members} />
            <RoomDetailsSortControl />

            <Button variant="outline" className="w-full border  border-danger/40 text-white/70 hover:bg-danger/15 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/30" onClick={reset}>
              <RefreshIcon className="text-sm mr-1" /> Reset all filters
            </Button>
          </div>

        </div>
      </div>
    </Sidebar>
  );
};