import { ReadOnlyStatusBadge, TitleActionsMenu } from "~/entities/titleRecord";
import { UserAvatar } from "~/entities/user";
import type { UserShort } from "~/entities/user/model/user.types";
import type { Status } from "~/shared/types";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import { useNavigate } from "react-router";

interface TitleLinkMemberProps {
  member: UserShort;
  rating: number | null;
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
    <div className="flex items-center justify-between py-3 px-2 hover:bg-muted/20 rounded-md transition-colors gap-2 border-b border-border/40 last:border-b-0">
      
     
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
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

     
      <div className="flex items-center gap-2 shrink-0">
        
        <div className="flex items-center justify-center">
          <ReadOnlyStatusBadge status={status} showDot={false} className="justify-center px-2.5 py-1" />
        </div>

        <div className="flex items-center justify-center min-w-[38px]">
            <CompactRatingLabel rating={rating} />
        </div>

        <div className="flex items-center justify-center pl-2 border-l border-border/60 h-5">
          <TitleActionsMenu titleId={titleId} isOwn={false} />
        </div>
      </div>
    </div>
  );
};