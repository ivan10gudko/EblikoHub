import React, { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button } from '~/shared/ui/Button';
import { Sidebar } from '~/shared/ui/Sidebar';
import { RoomRole, type Room, type RoomMemberShort } from "~/entities/room/model/room.types";
import { RoomMembersList } from './roomMemberList';
import { Link } from 'react-router';
import { titleTypeOptions } from '~/entities/titleRecord';
import { Checkbox } from '~/shared/ui/CheckBox';
import { Status, statusFilterStyles, statusOptionsFilters } from '~/shared/types/Status';
import { StatusButton } from '~/shared/ui/StatusButton';
import { RoomMemberMultiSelect } from './RoomMemberMultiSelect';
import { RoomDetailsSortControl } from './RoomDetailsFiltersModules/RoomDetailsSortControl';
import { RoomDetailsTypeFilter } from './RoomDetailsFiltersModules/RoomDetailsTypeFilter';
import { RoomDetailsStatusFilter } from './RoomDetailsFiltersModules/RoomDetailsStatusFilter';
import { RoomDetailsMemberFilter } from './RoomDetailsFiltersModules/RoomDetailsMembersFilter';
import { useRoomDetailsFilterStore } from '../store/roomDetailsFilter.store';


interface RoomDetailsSidebarProps {
  room: Room;
}

export const RoomDetailsSidebar = ({ room }: RoomDetailsSidebarProps) => {
  const {reset} = useRoomDetailsFilterStore();
  return (
    <Sidebar className="w-80 bg-background p-5 h-[calc(100vh-40px)] ml-5 my-5">
      <div className="flex flex-col gap-10 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto hide-scrollbar">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-primary text-xl leading-tight">{room.roomName}</h2>
            </div>
          </div>
          <Link to={`/rooms/${room.roomId}/settings`}>
            <SettingsIcon className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
          </Link>
        </div>

        <RoomMembersList members={room.members} />

        <div className=" border-t border-border pt-6 flex flex-col gap-5">
          <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
            <FilterListIcon className="text-sm" /> Group Filters
          </h3>

          <div className=" flex flex-col gap-5">
            <RoomDetailsTypeFilter />
            <RoomDetailsStatusFilter />
            <RoomDetailsMemberFilter members={room.members} />
            <RoomDetailsSortControl />

            <Button variant="outline" className="w-full h-10 text-xs mt-2" onClick={reset}>
              <RefreshIcon className="text-sm" /> Reset all filters
            </Button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}