import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Dropdown } from "~/shared/ui/DropDown";
import {
  DeleteDropdownItem,
  DropdownItem,
} from "~/shared/ui/DropDown/DropDown";
import { EditTitleModal } from "../../features/manageTitle/ui/EditTitleModal";
import { useState, type JSX } from "react";
import type { TitleRecord } from "~/entities/titleRecord";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { EditSeasonsModal } from "~/entities/season";
import ViewListIcon from "@mui/icons-material/ViewList";
import { EditRatingModal } from "~/features/TitleRating";

interface ActionItem {
  key: string;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  show?: boolean;
}

interface TitleActionsMenuProps {
  title: TitleRecord;
  isOwn: boolean;
  onDelete?: () => void;
  onOpenRatingModal: () => void; 
}

export const TitleActionsMenu = ({
  title,
  isOwn,
  onDelete,
  onOpenRatingModal, 
}: TitleActionsMenuProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSeasonsOpen, setIsSeasonsOpen] = useState(false);

  const handleCloseEdit = () => setIsEditOpen(false);
  const handleCloseSeasons = () => setIsSeasonsOpen(false);

  const actions: ActionItem[] = [
    {
      key: "edit",
      label: "Edit Record",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
      onClick: () => setIsEditOpen(true),
      show: isOwn,
    },
    {
      key: "rating",
      label: "Rating",
      icon: <StarRoundedIcon sx={{ fontSize: 16 }} />,
      onClick: onOpenRatingModal,
      show: true,
    },
    {
      key: "seasons",
      label: "Seasons",
      icon: <ViewListIcon sx={{ fontSize: 16 }} />,
      onClick: () => setIsSeasonsOpen(true),
      show: true,
    },
  ];

  return (
    <>
      <Dropdown
        align="start"
        trigger={
          <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground">
            <MoreHorizIcon sx={{ fontSize: 20 }} />
          </div>
        }
      >
        {actions
          .filter((item) => item.show)
          .map((item) => (
            <DropdownItem key={item.key} onClick={item.onClick} icon={item.icon}>
              {item.label}
            </DropdownItem>
          ))}

        {onDelete && (
          <>
            <div className="h-px bg-border my-1" />
            <DeleteDropdownItem onDelete={onDelete} />
          </>
        )}
      </Dropdown>

      <EditTitleModal
        title={title}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
      />
      
      {isSeasonsOpen && (
        <EditSeasonsModal
          titleId={title.titleId}
          titleName={title.titleName}
          isOpen={isSeasonsOpen}
          onClose={handleCloseSeasons}
          isOwn={isOwn}
        />
      )}
      
      
    </>
  );
};