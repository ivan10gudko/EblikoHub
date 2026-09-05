import { useState } from "react";
import { useNavigate } from "react-router";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { ReadOnlyStatusBadge, TitleTypeThemes } from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { RoomTitleSummary } from "~/features/manageRoomTitles";
import { CompactRatingLabel } from "~/shared/ui/Rating";

interface RoomMember {
  userId: string;
  username?: string;
  avatarUrl?: string;
}

interface RoomGroupWatchlistRowProps {
  title: RoomTitleSummary;
  index: number;
  roomMembers?: RoomMember[];
}

export const RoomGroupWatchlistRow = ({
  title,
  index,
  roomMembers = [],
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

  return (
    <div className="flex flex-col w-full">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 sm:gap-4 bg-card p-2 rounded-xl border border-border w-full cursor-pointer hover:border-border/80 transition-all ${themeClasses}`}
      >
        <div className="flex items-center justify-center h-10 w-6 flex-shrink-0">
          <span className="text-gray-400 font-bold text-sm sm:text-base">
            {index + 1}
          </span>
        </div>

        <div className="relative h-10 w-16 flex-shrink-0 cursor-pointer">
          <img
            src={title.titleInfo?.imageUrl || DEFAULT_IMAGE_PATH}
            onClick={handleImageClick}
            className="absolute inset-0 h-full w-full object-cover rounded-md"
            alt={title.titleInfo?.titleName}
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="font-bold text-foreground truncate block">
            {title.titleInfo?.titleName}
          </span>
        </div>

        {/* Компактний лейбл оцінки */}
        <div className="flex items-center justify-end flex-shrink-0">
          <CompactRatingLabel
            rating={title.computedAvgRating}
          />
        </div>

        {/* Бейдж статусу та стрілка розгортання */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <ReadOnlyStatusBadge status={title.myStatus ?? undefined} />

          <ExpandMoreRoundedIcon
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 bg-card/90 border border-border/60 rounded-xl p-3 flex flex-col gap-2 ml-6 w-[calc(100%-1.5rem)]">
          <div className="grid grid-cols-[1fr_auto] items-center px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border/40">
            <span>User</span>
            <span className="text-center px-4">Status</span>
          </div>

          {roomMembers.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-3">
              No members in this room.
            </div>
          ) : (
            roomMembers.map((member) => {
              const participation = title.userParticipation?.find(
                (p) => p.userId === member.userId
              );
              const status = participation?.status;
              const rating = participation?.overallRating;

              return (
                <div
                  key={member.userId}
                  className="grid grid-cols-[1fr_auto] items-center px-3 py-1.5 rounded-lg hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.username || member.userId}
                        className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <PersonRoundedIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm font-medium text-foreground truncate">
                      {member.username || member.userId}
                    </span>
                  </div>

                  <div className="flex justify-end min-w-[110px]">
                    <ReadOnlyStatusBadge status={status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};