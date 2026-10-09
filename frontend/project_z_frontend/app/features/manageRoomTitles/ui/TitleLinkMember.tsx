import { ReadOnlyStatusBadge, TitleActionsMenu, TitleType, TitleTypeThemes } from "~/entities/titleRecord";
import { UserAvatar } from "~/entities/user";
import type { UserShort } from "~/entities/user/model/user.types";
import type { Status } from "~/shared/types";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import { useNavigate } from "react-router";
import { cn } from "~/shared/lib";

interface TitleLinkMemberProps {
  member: UserShort;
  rating: number | null;
  status: Status;
  titleId: number;
  type?: TitleType;
}

export const TitleLinkMember = ({ member, rating, status, titleId, type }: TitleLinkMemberProps) => {
  const navigate = useNavigate();
  const themeClasses = type ? TitleTypeThemes[type] : "";
  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (member.userId) {
      navigate(`/profile/${member.userId}`);
    }
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto_40px_24px] items-center gap-2 px-2 py-3 hover:bg-muted/20 rounded-xl transition-colors",
        type ? "border shadow-sm" : "border-b border-border/40 last:border-b-0",
        themeClasses
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          onClick={handleAvatarClick}
          className="cursor-pointer transition-transform hover:scale-105 flex-shrink-0"
          title={`View ${member.name}'s profile`}
        >
          <UserAvatar src={member.img ?? undefined} name={member.name} size="sm" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">{member.name}</span>
          <span className="text-xs text-muted-foreground truncate">@{member.nameTag}</span>
        </div>
      </div>

      <div className="flex items-center justify-start">
        <ReadOnlyStatusBadge status={status} showDot={true} className="px-2 py-1" />
      </div>

      <div className="flex items-center justify-center">
        <CompactRatingLabel rating={rating} />
      </div>

      <div className="flex items-center justify-center">
        <TitleActionsMenu titleId={titleId} isOwn={false} />
      </div>
    </div>
  );
};