import { Link } from "react-router";
import { UserAvatar } from "~/entities/user";
import type { BadgeUser } from "../model/user.types";



interface UserBadgeCardProps {
  badge: BadgeUser;
  variant: "developer" | "respected";
}

export const UserBadgeCard = ({ badge, variant }: UserBadgeCardProps) => {
  const isDev = variant === "developer";

  return (
    <Link
      to={`/profile/${badge.user.userId}`}
      className={`flex items-center border border-border transition-all hover:bg-background-muted-hover group ${
        isDev
          ? "gap-4 bg-background-muted p-4 rounded-xl min-h-[88px]"
          : "gap-3 bg-background-muted/60 p-4 rounded-lg min-h-[72px]"
      }`}
    >
      
      <div
        className={`flex-shrink-0 rounded-full overflow-hidden ${
          isDev ? "border-2 border-emerald-500" : ""
        }`}
      >
        <UserAvatar src={badge.user.img} name={badge.user.name} size="sm" />
      </div>

     
      <div className="truncate">
        {isDev ? (
          <>
            <h4 className="font-bold group-hover:text-primary transition-colors truncate">
              {badge.user.name}
            </h4>
            <p className="text-foreground-muted text-xs text-ellipsis overflow-hidden opacity-70 truncate">
              {badge.user.description || "Developer"}
            </p>
          </>
        ) : (
          <>
            <span className="block font-medium text-sm group-hover:text-primary transition-colors truncate">
              {badge.user.name}
            </span>
            <span className="block text-[10px] uppercase text-foreground-muted opacity-60 tracking-wider">
              {badge.type.toLowerCase()}
            </span>
          </>
        )}
      </div>
    </Link>
  );
};