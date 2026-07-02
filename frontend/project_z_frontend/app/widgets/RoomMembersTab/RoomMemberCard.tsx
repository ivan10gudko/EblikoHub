import React, { useState } from "react";
import { useNavigate } from "react-router";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShieldIcon from "@mui/icons-material/Shield";
import StarIcon from "@mui/icons-material/Star";
import GavelIcon from "@mui/icons-material/Gavel";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import PersonIcon from "@mui/icons-material/Person";
import { UserAvatar } from "~/entities/user";
import type { RoomMemberShort } from "~/entities/room/model/room.types";

interface RoomMemberCardProps {
    member: RoomMemberShort;
    roomOwnerId?: string | number;
    currentUserId: string | number;
    isCurrentUserAdmin: boolean;
}

export const RoomMemberCard: React.FC<RoomMemberCardProps> = ({
    member,
    roomOwnerId,
    currentUserId,
    isCurrentUserAdmin,
}) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const userData = member.user;
    const realUserId = userData?.userId;
    const displayName = userData?.name || "Unknown User";
    const nameTag = userData?.nameTag;
    const avatarSrc = userData?.img;

    const isOwner = member.role === "OWNER" || (Boolean(realUserId) && String(realUserId) === String(roomOwnerId));
    const isAdmin = member.role === "ADMIN" && !isOwner;
    const isSelf = String(realUserId) === String(currentUserId);

    const canManage = isCurrentUserAdmin && !isSelf && !isOwner;

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = (event?: React.MouseEvent | React.SyntheticEvent) => {
        if (event) event.stopPropagation();
        setAnchorEl(null);
    };

    const handleAction = (event: React.MouseEvent, actionType: string) => {
        event.stopPropagation();
        setAnchorEl(null);
        console.log(`Action: ${actionType} on ${displayName}`);
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
                    <span className="text-xs text-muted-foreground/70 truncate mt-0.5 font-medium">
                        @{nameTag}
                    </span>
                )}

                <div className="flex items-center gap-1 mt-2">
                    {isOwner ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-amber-500/10 border-amber-500/20 text-amber-500">
                            <StarIcon style={{ fontSize: "14px", marginTop: "-1px" }} />
                            <span className="leading-none">Owner</span>
                        </span>
                    ) : isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-blue-500/10 border-blue-500/20 text-blue-400">
                            <ShieldIcon style={{ fontSize: "14px", marginTop: "-1px" }} />
                            <span className="leading-none">Admin</span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-white/5 border-white/10 text-white/50">
                            <PersonIcon style={{ fontSize: "14px", marginTop: "-1px" }} />
                            <span className="leading-none">Member</span>
                        </span>
                    )}
                </div>
            </div>

            {canManage && (
                <>
                    <div className="absolute top-2 right-2 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
                        <IconButton
                            size="small"
                            onClick={handleOpenMenu}
                            sx={{
                                color: "var(--foreground-muted)",
                                padding: "4px",
                                "&:hover": { color: "var(--primary)", backgroundColor: "rgba(var(--primary-rgb), 0.1)" },
                            }}
                        >
                            <MoreVertIcon fontSize="small" sx={{ fontSize: 18 }} />
                        </IconButton>
                    </div>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        slotProps={{
                            paper: {
                                onClick: (e: React.MouseEvent) => e.stopPropagation(),
                                sx: {
                                    backgroundColor: "var(--card)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "12px",
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                                    color: "var(--foreground)",
                                    minWidth: "185px",
                                    padding: "4px 0",
                                },
                            },
                        }}
                    >
                        {member.role === "ADMIN" ? (
                            <MenuItem onClick={(e) => handleAction(e, "demote")} className="gap-2.5 text-xs! font-medium! py-2">
                                <ArrowDownwardIcon sx={{ fontSize: 16, color: "var(--foreground-muted)" }} />
                                Demote to Member
                            </MenuItem>
                        ) : (
                            <MenuItem onClick={(e) => handleAction(e, "promote")} className="gap-2.5 text-xs! font-medium! py-2">
                                <ArrowUpwardIcon sx={{ fontSize: 16, color: "var(--primary)" }} />
                                Promote to Admin
                            </MenuItem>
                        )}

                        <div className="border-t border-(--border)/60 my-1" />

                        <MenuItem onClick={(e) => handleAction(e, "ban")} className="gap-2.5 !text-xs !font-medium !text-red-600 py-2">
                            <GavelIcon sx={{ fontSize: 16 }} />
                            Ban User
                        </MenuItem>
                    </Menu>
                </>
            )}
        </div>
    );
};