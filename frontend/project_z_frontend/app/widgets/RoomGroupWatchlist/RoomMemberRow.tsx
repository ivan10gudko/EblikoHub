import { ReadOnlyStatusBadge } from "~/entities/titleRecord";
import { UserAvatar } from "~/entities/user";
import type { UserCacheItem, UserParticipation } from "~/entities/user/model/user.types";
import { CompactRatingLabel } from "~/shared/ui/Rating";

interface RoomMemberRowProps {
  member: UserCacheItem;
  participation?: UserParticipation;
}

export const RoomMemberRow = ({ member, participation }: RoomMemberRowProps) => {
  return (
    <div className="grid grid-cols-[1fr_80px_130px] items-center px-3 py-2 rounded-lg hover:bg-muted/30">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar src={member.img ?? undefined} name={member.name} size="sm" />

        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium text-foreground truncate">
            {member.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            @{member.nameTag}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {participation?.overallRating !== undefined && participation.overallRating > 0 ? (
          <CompactRatingLabel rating={participation.overallRating} />
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </div>
      <div className="flex items-center justify-end">
        <ReadOnlyStatusBadge status={participation?.status} />
      </div>
    </div>
  );
};