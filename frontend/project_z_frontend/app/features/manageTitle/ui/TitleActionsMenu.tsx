import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Dropdown } from "~/shared/ui/DropDown";
import { DeleteDropdownItem, DropdownItem } from "~/shared/ui/DropDown/DropDown";
import { EditTitleModal } from "./EditTitleModal";
import { useState } from "react";
import type { TitleRecord } from "~/entities/titleRecord";

interface TitleActionsMenuProps {
  title: TitleRecord;
  onDelete: () => void;
}

export const TitleActionsMenu = ({ title, onDelete }: TitleActionsMenuProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCloseEdit = () => setIsEditOpen(false);

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
    </>
  );
};