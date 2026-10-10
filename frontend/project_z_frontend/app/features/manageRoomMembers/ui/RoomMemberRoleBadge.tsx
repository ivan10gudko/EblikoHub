import ShieldIcon from "@mui/icons-material/Shield";
import StarIconActual from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import { RoomRole } from "~/entities/room/model/room.types";

interface RoleConfig {
    label: string;
    icon: React.ElementType;
    className: string;
}

const ROLE_CONFIGS: Record<RoomRole, RoleConfig> = {
    [RoomRole.OWNER]: {
        label: "Owner",
        icon: StarIconActual,
        className: "bg-amber-500/10 border-amber-500/20 text-amber-500",
    },
    [RoomRole.ADMIN]: {
        label: "Admin",
        icon: ShieldIcon,
        className: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    },
    [RoomRole.MEMBER]: {
        label: "Member",
        icon: PersonIcon,
        className: "bg-foreground-muted/5 border-border text-foreground-muted",
    },
};

interface RoleBadgeProps {
    role: RoomRole;
}

export const RoomMemberRoleBadge = ({ role }: RoleBadgeProps) => {
    const config = ROLE_CONFIGS[role] || ROLE_CONFIGS[RoomRole.MEMBER];
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-medium ${config.className}`}>
            <IconComponent style={{ fontSize: "14px", marginTop: "-1px" }} />
            <span className="leading-none">{config.label}</span>
        </span>
    );
};