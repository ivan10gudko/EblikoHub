import React from "react";
import StarIcon from "@mui/icons-material/MoreVert"; // Твій оригінальний імпорт MoreVertIcon або StarIcon
import ShieldIcon from "@mui/icons-material/Shield";
import StarIconActual from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { RoomRole, type RoomMemberShort } from "~/entities/room/model/room.types";





interface RoleBadgeProps {
    role: RoomRole;
}

export const RoomMemberRoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
    if (role === RoomRole.OWNER) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-amber-500/10 border-amber-500/20 text-amber-500">
                <StarIconActual style={{ fontSize: "14px", marginTop: "-1px" }} />
                <span className="leading-none">Owner</span>
            </span>
        );
    }

    if (role === RoomRole.ADMIN) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-blue-500/10 border-blue-500/20 text-blue-400">
                <ShieldIcon style={{ fontSize: "14px", marginTop: "-1px" }} />
                <span className="leading-none">Admin</span>
            </span>
        );
    }

    
    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium bg-foreground-muted/5 border-border text-foreground-muted">
            <PersonIcon style={{ fontSize: "14px", marginTop: "-1px" }} />
            <span className="leading-none">Member</span>
        </span>
    );
};