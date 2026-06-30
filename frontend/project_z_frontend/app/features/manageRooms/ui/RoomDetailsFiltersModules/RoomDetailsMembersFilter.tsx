import { useRoomDetailsFilterStore } from '../../store/roomDetailsFilter.store';
import { RoomMemberMultiSelect } from '../RoomMemberMultiSelect';
import { type RoomMemberShort } from "~/entities/room/model/room.types";

export const RoomDetailsMemberFilter = ({ members }: { members: RoomMemberShort[] }) => {
    const { memberIds, setMembers } = useRoomDetailsFilterStore();
    const clearSelection = () => setMembers([]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <label className="text-[13px] uppercase font-bold text-muted-foreground">
                    Show titles for
                </label>
                {memberIds.length > 0 && (
                    <button
                        onClick={clearSelection}
                        className="text-[10px] uppercase font-bold text-primary hover:underline cursor-pointer"
                    >
                        Reset
                    </button>
                )}
            </div>

            <RoomMemberMultiSelect
                members={members}
                selectedIds={memberIds}
                onChange={setMembers}
            />

            <p className="text-[11px] text-muted-foreground italic">
                {memberIds.length === 0
                    ? "Showing titles for everyone in the room."
                    : `Filtering by ${memberIds.length} selected member${memberIds.length > 1 ? 's' : ''}.`}
            </p>
        </div>
    );
}