
import { TitleTypeThemes } from "~/entities/titleRecord";
import type { RoomTitleWithUserLinks } from "~/features/manageRooms";
import { Dropdown } from "~/shared/ui/DropDown";
import { DropdownItem } from "~/shared/ui/DropDown/DropDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRoomModal } from "~/features/manageRooms/hooks/useRoomModal";
interface RoomTitleRowProps {
    title: RoomTitleWithUserLinks;
}
const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
export const RoomTitleReadOnlyRowShort = ({ title }: RoomTitleRowProps) => {
    const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : ""
    const { openSettingsModal } = useRoomModal();
    return (
        <div className={`group/row flex items-center gap-4 bg-card p-2 rounded-xl border border-border/50 transition-all duration-300 w-full min-w-0 ${themeClasses}`}>
            <div className="w-[20px]" />

            <div className="relative h-10 w-16 flex-shrink-0">
                <img
                    src={title.imageUrl || DEFAULT_IMAGE_PATH}
                    className="h-full w-full object-cover rounded-md"
                    alt={title.titleName}
                />
            </div>

            <div className="flex-1 min-w-0">
                <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm">
                    {title.titleName}
                </span>
            </div>

            <div className="ml-auto flex items-center pr-2">
                <Dropdown
                    trigger={
                        <button className="p-1 hover:bg-border/50 rounded-lg transition-colors text-foreground">
                            <MoreVertIcon sx={{ fontSize: 20 }} />
                        </button>
                    }
                >
                    <DropdownItem
                        icon={<VisibilityIcon sx={{ fontSize: 16 }} />}
                        onClick={() => {
                            openSettingsModal('user-links', title.id)
                        }
                        }
                    >
                        View room title links
                    </DropdownItem>

                </Dropdown>
            </div>
        </div >
    );
};