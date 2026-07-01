import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Dropdown } from "~/shared/ui/DropDown";
import { DeleteDropdownItem } from "~/shared/ui/DropDown/DropDown";
import type { DraftSeason, Season } from "~/entities/season";

interface SeasonActionsMenuProps {
  season: Season | DraftSeason;
  onDelete: () => void;

}

export const SeasonActionsMenu = ({ season: _season, onDelete }: SeasonActionsMenuProps) => {
  return (
    <>
      <Dropdown
        align="end"
        trigger={
          <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground cursor-pointer">
            <MoreHorizIcon sx={{ fontSize: 20 }} />
          </div>
        }
      >
        <DeleteDropdownItem onDelete={onDelete} />
      </Dropdown>
    </>
  );
};