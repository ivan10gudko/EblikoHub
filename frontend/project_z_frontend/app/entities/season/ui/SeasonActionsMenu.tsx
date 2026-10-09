import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Dropdown } from "~/shared/ui/DropDown";
import {
  DeleteDropdownItem,
  DropdownItem,
} from "~/shared/ui/DropDown/DropDown";
import type { JSX } from "react";
import { useNavigate } from "react-router";
import type { DraftSeason, Season } from "~/entities/season";

interface ActionItem {
  key: string;
  label: string;
  icon: JSX.Element;
  onClick: () => void;
  show?: boolean;
}

interface SeasonActionsMenuProps {
  season: Season | DraftSeason;
  titleId: number;
  isOwn: boolean;
  onDelete: () => void;
}

export const SeasonActionsMenu = ({
  season,
  titleId,
  isOwn,
  onDelete,
}: SeasonActionsMenuProps) => {
  const navigate = useNavigate();
  const seasonId = season.seasonId;

  const actions: ActionItem[] = [
    {
      key: "view",
      label: "View Details",
      icon: <VisibilityIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        if (seasonId) navigate(`view/${seasonId}`);
      },
      show: !!seasonId,
    },
    {
      key: "edit",
      label: "Edit Record",
      icon: <EditIcon sx={{ fontSize: 16 }} />,
      onClick: () => {
        if (seasonId) navigate(`edit/${seasonId}`);
      },
      show: isOwn && !!seasonId,
    },
  ];

  return (
    <Dropdown
      align="end"
      trigger={
        <div className="p-1.5 hover:bg-border/50 rounded-lg transition-colors text-foreground/50 hover:text-foreground cursor-pointer">
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
          {actions.some((item) => item.show) && (
            <div className="h-px bg-border my-1" />
          )}
          <DeleteDropdownItem onDelete={onDelete} />
        </>
      )}
    </Dropdown>
  );
};