import React from "react";
import { useNavigate } from "react-router";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { UserAvatar } from "~/entities/user";

import { RoomRole, type RoomMemberShort } from "~/entities/room/model/room.types";
import { RoomMemberRoleBadge } from "~/features/manageRoomMembers/ui/RoomMemberRoleBadge";
import { useRoomMemberActions } from "~/features/manageRoomMembers/hooks/useRoomMemberActions";
import { useRoomBanActions } from "~/features/manageRoomBans/hooks/useRoomBanActions";
import { notify } from "~/shared/lib";
import { Dropdown } from "~/shared/ui/DropDown";
import { BanDropdownItem, DropdownItem } from "~/shared/ui/DropDown/DropDown";

interface RoomMemberCardProps {
  roomId: number;
  member: RoomMemberShort;
  roomOwnerId?: string;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
}

export const RoomMemberCard: React.FC<RoomMemberCardProps> = ({
  roomId,
  member,
  roomOwnerId,
  currentUserId,
  isCurrentUserAdmin,
}) => {
  const navigate = useNavigate();

  const numericRoomId = Number(roomId);
  const { updateMemberRole, isUpdatingRole } = useRoomMemberActions(numericRoomId);
  const { banUser, isPending: isBanning } = useRoomBanActions(numericRoomId);

  const userData = member.user;
  const realUserId = userData?.userId;
  const displayName = userData?.name || "Unknown User";
  const nameTag = userData?.nameTag;
  const avatarSrc = userData?.img;

  const isOwner =
    member.role === RoomRole.OWNER ||
    (Boolean(realUserId) && String(realUserId) === String(roomOwnerId));
  const isSelf = String(realUserId) === String(currentUserId);
  const canManage = isCurrentUserAdmin && !isSelf && !isOwner;
  const isActionPending = isUpdatingRole || isBanning;

  const handleRoleChange = (newRole: RoomRole) => (event: Event) => {
    event.stopPropagation();

    if (!realUserId) {
      notify.error("Cannot update role for a user without a valid ID");
      return;
    }

    updateMemberRole({
      roomMemberId: member.id,
      role: newRole,
    });
  };

  const handleBanAction = (event?: Event) => {
    if (event) {
      event.stopPropagation();
    }

    if (!realUserId) {
      notify.error("Cannot ban a user without a valid ID");
      return;
    }

    banUser({
      userId: realUserId,
      reason: "Banned by Admin via member list",
      userData: {
        name: displayName,
        nameTag: nameTag || undefined,
        img: avatarSrc,
      },
    });
  };

  return (
    <div
      onClick={() => realUserId && navigate(`/profile/${realUserId}`)}
      className="relative flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] cursor-pointer transition-all duration-200 group min-h-[96px]"
    >
      <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
        <UserAvatar name={displayName} src={avatarSrc} size="md" />
      </div>

      <div className="flex flex-col min-w-0 flex-1 pr-6">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-bold text-foreground truncate tracking-wide group-hover:text-primary transition-colors">
            {displayName}
          </span>
          {isSelf && (
            <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-md shrink-0">
              You
            </span>
          )}
        </div>

        {nameTag && (
          <span className="text-xs text-foreground-muted truncate mt-0.5 font-medium">
            @{nameTag}
          </span>
        )}

        <div className="flex items-center gap-1 mt-2">
          <RoomMemberRoleBadge role={member.role} />
        </div>
      </div>

      {canManage && (
        <div
          className="absolute top-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown
            align="end"
            trigger={
              <IconButton
                size="small"
                disabled={isActionPending}
                sx={{
                  color: "var(--foreground-muted)",
                  padding: "4px",
                  "&:hover": {
                    color: "var(--primary)",
                    backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                  },
                }}
              >
                <MoreVertIcon fontSize="small" sx={{ fontSize: 18 }} />
              </IconButton>
            }
          >
            {member.role === RoomRole.ADMIN ? (
              <DropdownItem
                onClick={handleRoleChange(RoomRole.MEMBER)}
                icon={<ArrowDownwardIcon sx={{ fontSize: 16 }} />}
              >
                Demote to Member
              </DropdownItem>
            ) : (
              <DropdownItem
                onClick={handleRoleChange(RoomRole.ADMIN)}
                icon={
                  <ArrowUpwardIcon
                    sx={{ fontSize: 16, color: "var(--primary)" }}
                  />
                }
              >
                Promote to Admin
              </DropdownItem>
            )}

            <div className="border-t border-border/60 my-1 " />

            <BanDropdownItem onBan={handleBanAction} />
          </Dropdown>
        </div>
      )}
    </div>
  );
};