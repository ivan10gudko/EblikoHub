import { ReadOnlyStatusBadge, TitleActionsMenu } from "~/entities/titleRecord";
import { UserAvatar } from "~/entities/user";
import type { UserShort } from "~/entities/user/model/user.types";
import type { Status } from "~/shared/types";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import { useNavigate } from "react-router";

interface TitleLinkMemberProps {
  member: UserShort;
  rating: number;
  status: Status;
  titleId: number;
}

export const TitleLinkMember = ({ member, rating, status, titleId }: TitleLinkMemberProps) => {
  const navigate = useNavigate();

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (member.userId) {
      navigate(`/profile/${member.userId}`);
    }
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_80px_130px_40px] items-center px-3 py-2 rounded-lg hover:bg-muted/30 gap-3">
      <div className="flex items-center gap-3 min-w-0">
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

      <div className="flex items-center justify-center">
        {rating !== undefined && rating > 0 ? (
          <CompactRatingLabel rating={rating} />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <ReadOnlyStatusBadge status={status} showDot={false} className="justify-center" />
      </div>

      <div className="w-10 h-8 flex items-center justify-center border-l border-border">
        <TitleActionsMenu titleId={titleId} isOwn={false} />
      </div>
    </div>
  );
};