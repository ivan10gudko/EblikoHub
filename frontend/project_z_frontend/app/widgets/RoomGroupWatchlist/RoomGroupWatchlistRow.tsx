import { useState } from "react";
import { useNavigate } from "react-router";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import {
  ReadOnlyStatusBadge,
  TitleTypeThemes,
  TitleType,
} from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { RoomTitleSummary } from "~/features/manageRoomTitles";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import type { UserCacheItem } from "~/entities/user/model/user.types";
import { UserAvatar } from "~/entities/user";
import { RoomMemberRow } from "./RoomMemberRow";
import { Status } from "~/shared/types";

interface RoomGroupWatchlistRowProps {
  title: RoomTitleSummary;
  index: number;
  usersCache: Record<string, UserCacheItem>;
  onTypeChange?: (roomTitleId: string, newType: string) => void;
}

const statusBorderMap: Record<Status, string> = {
  [Status.WATCHED]: "border-green-500",
  [Status.PLANNED]: "border-blue-400",
  [Status.INPROGRESS]: "border-primary",
  [Status.DROPPED]: "border-red-500",
  [Status.DEFAULT]: "border-border",
  [Status.UPCOMING]: "border-purple-400",
};

const getStatusBorderClass = (status?: string | null): string => {
  if (!status || !(status in statusBorderMap)) {
    return "border-border";
  }
  return statusBorderMap[status as Status];
};

export const RoomGroupWatchlistRow = ({
  title,
  index,
  usersCache,
}: RoomGroupWatchlistRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (title.titleInfo?.apiTitleId) {
      navigate(`/anime/${title.titleInfo.apiTitleId}`);
    }
  };

  const rawType = title.myTitleInfo?.type || title.titleInfo?.titleType;
  const currentType: TitleType =
    rawType && rawType in TitleTypeThemes
      ? (rawType as TitleType)
      : TitleType.ANIME;

  const themeClasses = TitleTypeThemes[currentType];

  const participations = title.userParticipation ?? [];
  const visibleParticipations = participations.slice(0, 3);
  const extraCount = participations.length - 3;

  return (
    <div className="flex flex-col w-full transition-all duration-200">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl border w-full cursor-pointer shadow-sm hover:shadow-md transition-all ${themeClasses}`}
      >
        <div className="flex items-center justify-center h-10 w-6 flex-shrink-0">
          <span className="text-muted-foreground font-bold text-sm sm:text-base">
            {index + 1}
          </span>
        </div>

        <div className="relative h-12 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-inner bg-muted/20">
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
        </div>

        <div className="flex items-center -space-x-2 flex-shrink-0 py-1 px-1">
          {visibleParticipations.map((p) => {
            const member = usersCache[p.userId];
            if (!member) return null;

            return (
              <div
                key={p.userId}
                className={`relative flex items-center justify-center rounded-full border-2 bg-card transition-transform hover:z-20 hover:scale-110 ${getStatusBorderClass(
                  p.status
                )}`}
                title={`${member.name} (${p.status ?? "No status"})`}
              >
                <UserAvatar
                  src={member.img ?? undefined}
                  name={member.name}
                  size="minPlus"
                />
              </div>
            );
          })}

          {extraCount > 0 && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground text-[10px] font-bold border-2 border-border z-10">
              +{extraCount}
            </div>
          )}
        </div>

        <div
          className="flex items-center justify-end flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <CompactRatingLabel rating={title.computedAvgRating} />
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <div onClick={(e) => e.stopPropagation()}>
            <ReadOnlyStatusBadge
              status={title.myStatus ?? undefined}
              showDot={false}
            />
          </div>

          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/40 hover:bg-muted transition-colors">
            <ExpandMoreRoundedIcon
              className={`text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                }`}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-4 flex flex-col gap-2 ml-4 sm:ml-8 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-[1fr_80px_130px] items-center px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/40">
            <span>Room Member</span>
            <span className="text-center">Rating</span>
            <span className="text-center">Status</span>
          </div>

          {participations.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-6">
              No participation yet.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {participations.map((participation) => {
                const member = usersCache[participation.userId];

                if (!member) return null;

                return (
                  <RoomMemberRow
                    key={participation.userId}
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