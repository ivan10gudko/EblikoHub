import { useState } from "react";
import { useNavigate } from "react-router";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { ReadOnlyStatusBadge, TitleTypeThemes } from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { RoomTitleSummary } from "~/features/manageRoomTitles";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import { RoomMemberRow, type UserCacheItem } from "./RoomMemberRow";

interface RoomGroupWatchlistRowProps {
  title: RoomTitleSummary;
  index: number;
  usersCache?: Record<string, UserCacheItem>;
}

export const RoomGroupWatchlistRow = ({
  title,
  index,
  usersCache = {},
}: RoomGroupWatchlistRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.titleInfo?.apiTitleId) {
      navigate(`/anime/${title.titleInfo.apiTitleId}`);
    }
  };

  const themeClasses = title.titleInfo?.titleType
    ? TitleTypeThemes[title.titleInfo.titleType as keyof typeof TitleTypeThemes]
    : "";

  const roomMembers = Object.keys(usersCache).length > 0
    ? Object.values(usersCache)
    : Array.from(
      new Map(
        (title.userParticipation || []).map((p) => [
          p.userId,
          { userId: p.userId, name: p.userId, nameTag: p.userId, img: null },
        ])
      ).values()
    );

  return (
    <div className="flex flex-col w-full transition-all duration-200">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 sm:gap-4 bg-card p-3 sm:p-3.5 rounded-2xl border border-border w-full cursor-pointer hover:border-border/80 shadow-sm hover:shadow-md transition-all ${themeClasses}`}
      >
        <div className="flex items-center justify-center h-10 w-6 flex-shrink-0">
          <span className="text-muted-foreground font-bold text-sm sm:text-base">
            {index + 1}
          </span>
        </div>

        <div className="relative h-12 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-inner">
          <img
            src={title.titleInfo?.imageUrl || DEFAULT_IMAGE_PATH}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105 duration-200"
            alt={title.titleInfo?.titleName || "Title poster"}
          />
        </div>

        <div className="flex-1 min-w-0 px-1">
          <span className="font-bold text-foreground text-sm sm:text-base truncate block">
            {title.titleInfo?.titleName}
          </span>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {title.titleInfo?.titleType || "ANIME"}
          </span>
        </div>

        <div
          className="flex items-center justify-end flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <CompactRatingLabel rating={title.computedAvgRating} />
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <ReadOnlyStatusBadge status={title.myStatus ?? undefined} />
          </div>

          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/40 hover:bg-muted transition-colors">
            <ExpandMoreRoundedIcon
              className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </div>
        </div>
      </div>

      { isOpen && (
        <div className="mt-2 bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-4 flex flex-col gap-2 ml-4 sm:ml-8 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-[1fr_80px_130px] items-center px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/40">
            <span>Room Member</span>
            <span className="text-center">Rating</span>
            <span className="text-right">Status</span>
          </div>

          {roomMembers.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-6">
              No members in this room.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {roomMembers.map((member) => {
                const participation = title.userParticipation?.find(
                  (p) => p.userId === member.userId
                );

                return (
                  <RoomMemberRow
                    key={member.userId}
                    member={member}
                    participation={participation}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};