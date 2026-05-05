import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Dropdown } from "~/shared/ui/DropDown";
import { DeleteDropdownItem, DropdownItem } from "~/shared/ui/DropDown/DropDown";
import { EditTitleModal } from "./EditTitleModal";
import { useState } from "react";
import type { TitleRecord } from "~/entities/titleRecord";
import { EditRatingModal } from "./EditRatingModal";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
interface TitleActionsMenuProps {
  title: TitleRecord;
  onDelete: () => void;
}

export const TitleActionsMenu = ({ title, onDelete }: TitleActionsMenuProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const handleCloseEdit = () => setIsEditOpen(false);
  const handleCloseRatings = () => setIsRatingsOpen(false);

  return (
    <>
      <Dropdown
        align="right"
        trigger={
          <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground">
            <MoreHorizIcon sx={{ fontSize: 20 }} />
          </div>
        }
      >
        <DropdownItem onClick={() => setIsEditOpen(true)}>
          <EditIcon sx={{ fontSize: 16 }} />
          Edit Record
        </DropdownItem>
        <DropdownItem onClick={() => setIsRatingsOpen(true)}>
          <StarRoundedIcon sx={{ fontSize: 16 }}/>
          Rating
        </DropdownItem>

        <div className="h-px bg-border my-1" />

        <DeleteDropdownItem
        onDelete={onDelete}
        />
      </Dropdown>

      <EditTitleModal
        title={title}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
      />
      <EditRatingModal
        title = {title}
        isOpen = {isRatingsOpen}
        onClose={handleCloseRatings}
      />
    </>
  );
};