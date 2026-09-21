import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import { Dropdown } from "~/shared/ui/DropDown";
import {
  DeleteDropdownItem,
  DropdownItem,
} from "~/shared/ui/DropDown/DropDown";
import type { JSX } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ViewListIcon from "@mui/icons-material/ViewList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router";

interface ActionItem {
  key: string;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  show?: boolean;
}

interface TitleActionsMenuProps {
  titleId: number;
  isOwn: boolean;
  onDelete?: () => void;
}

export const TitleActionsMenu = ({
  titleId,
  isOwn,
  onDelete,
}: TitleActionsMenuProps) => {
  const navigate = useNavigate();
  const openRating = () => navigate(`rating/${titleId}`);
  const actions: ActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: <VisibilityIcon sx={{ fontSize: 16 }} />,
      onClick: () => navigate(`view/${titleId}`),
      show: true,
    },
    {
      key: "edit",
      label: "Edit Record",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
      onClick: () => navigate(`edit/${titleId}`),
      show: isOwn,
    },
    {
      key: "rating",
      label: "Rating",
      icon: <StarRoundedIcon sx={{ fontSize: 16 }} />,
      onClick: openRating,
      show: true,
    },
    {
      key: "seasons",
      label: "Seasons",
      icon: <ViewListIcon sx={{ fontSize: 16 }} />,
      onClick: () => navigate(`seasons/${titleId}`),
      show: true,
    },
  ];

  return (
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
  );
};