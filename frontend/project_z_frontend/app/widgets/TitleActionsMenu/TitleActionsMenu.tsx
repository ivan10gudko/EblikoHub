import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Dropdown } from "~/shared/ui/DropDown";
import {
  DeleteDropdownItem,
  DropdownItem,
} from "~/shared/ui/DropDown/DropDown";
import { EditTitleModal } from "../../features/manageTitle/ui/EditTitleModal";
import { useState } from "react";
import type { TitleRecord } from "~/entities/titleRecord";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { EditSeasonsModal } from "~/entities/season";
import ViewListIcon from "@mui/icons-material/ViewList";
import { EditRatingModal } from "~/features/TitleRating";
interface TitleActionsMenuProps {
  title: TitleRecord;
  isOwn: boolean
  onDelete?: () => void;

}

export const TitleActionsMenu = ({
  title,
  isOwn,
  onDelete,
}: TitleActionsMenuProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRatingsOpen, setIsRatingsOpen] = useState(false);
  const [isSeasonsOpen, setIsSeasonsOpen] = useState(false);
  const handleCloseEdit = () => setIsEditOpen(false);
  const handleCloseRatings = () => setIsRatingsOpen(false);
  const handleCloseSeasons = () => setIsSeasonsOpen(false);

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
        {isOwn ? <DropdownItem onClick={() => setIsEditOpen(true)}> <EditIcon sx={{ fontSize: 16 }} /> Edit Record </DropdownItem>
          : <></>}
        <DropdownItem onClick={() => setIsRatingsOpen(true)}>
          <StarRoundedIcon sx={{ fontSize: 16 }} />
          Rating
        </DropdownItem>
        <DropdownItem onClick={() => setIsSeasonsOpen(true)}>
          <ViewListIcon sx={{ fontSize: 16 }} />
          Seasons
        </DropdownItem>
        <div className="h-px bg-border my-1" />
        {onDelete ? <DeleteDropdownItem onDelete={onDelete} /> : <></>}
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
        />
      )}
      <EditRatingModal
        title={title}
        isOpen={isRatingsOpen}
        onClose={handleCloseRatings}
      />
    </>
  );
};
