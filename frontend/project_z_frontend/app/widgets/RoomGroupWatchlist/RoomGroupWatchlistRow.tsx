import { useState } from "react";
import { useNavigate } from "react-router";

import { ReadOnlyStatusBadge, TitleTypeThemes } from "~/entities/titleRecord";
import { TitleLinkMember, type RoomTitleSummary } from "~/features/manageRoomTitles";
import { CompactRatingLabel } from "~/shared/ui/Rating";
import { UserAvatar } from "~/entities/user";
import { Status } from "~/shared/types";
import type { UserShort } from "~/entities/user/model/user.types";
import { cn } from "~/shared/lib";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Dropdown } from "~/shared/ui/DropDown";
import { DropdownItem } from "~/shared/ui/DropDown/DropDown";
import LinkIcon from "@mui/icons-material/Link";
import { TitleHoverPreview } from "~/shared/ui/HoverPreviewImage";

const getDisplayTitleInfo = (title: RoomTitleSummary, showMyVisual: boolean) => {
  if (showMyVisual && title.myTitleInfo) {
    return title.myTitleInfo;
  }
  return title.titleInfo;
};

const getTargetApiTitleId = (title: RoomTitleSummary, showMyVisual: boolean): number | undefined => {
  if (showMyVisual) {
    return title.myTitleInfo?.apiTitleId;
  }
  return title.titleInfo?.apiTitleId;
};

interface RoomGroupWatchlistRowProps {
  title: RoomTitleSummary;
  index: number;
  usersCache: Record<string, UserShort>;
  onTypeChange?: (roomTitleId: string, newType: string) => void;
  showMyVisual?: boolean;
  isMember?: boolean;
}

const statusBorderMap: Record<Status, string> = {
  [Status.WATCHED]: "border-green-500",
  [Status.PLANNED]: "border-blue-400",
  [Status.INPROGRESS]: "border-primary",
  [Status.DROPPED]: "border-red-500",
  [Status.DEFAULT]: "border-border",
  [Status.UPCOMING]: "border-purple-400",
};

const getStatusBorderClass = (status: Status): string => statusBorderMap[status];

export const RoomGroupWatchlistRow = ({
  title,
  index,
  usersCache,
  showMyVisual = false,
  isMember = false
}: RoomGroupWatchlistRowProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const displayInfo = getDisplayTitleInfo(title, showMyVisual);

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const targetApiId = getTargetApiTitleId(title, showMyVisual);

    if (targetApiId) {
      navigate(`/anime/${targetApiId}`);
    }
  };

  const handleOpenDetailsModal = () => {
    if (title.roomTitleId) {
      navigate(`detailsLinks/${title.roomTitleId}`);
    }
  };

  const handleGoToLinks = () => {
    navigate(`settings/titles/titleLinks`);
  };

  const themeClasses = TitleTypeThemes[displayInfo.type];
  const participations = title.userParticipation ?? [];
  const visibleParticipations = participations.slice(0, 3);
  const extraCount = participations.length - 3;

  return (
    <div className="flex flex-col w-full transition-all duration-200">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 sm:p-3.5 rounded-2xl border w-full cursor-pointer shadow-sm hover:shadow-md transition-all ${themeClasses}`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center justify-center h-10 w-6 flex-shrink-0">
            <span className="text-muted-foreground font-bold text-sm sm:text-base">{index + 1}</span>
          </div>

          <TitleHoverPreview
            imageUrl={displayInfo?.imageUrl ?? undefined}
            titleName={displayInfo?.titleName || title.titleInfo?.titleName || "Title poster"}
            onClick={handleImageClick}
            className="h-12 w-20 rounded-lg shadow-inner bg-muted/20 flex-shrink-0"
          />

          <div className="flex-1 min-w-0 px-1">
            <span className="font-bold text-foreground text-sm sm:text-base truncate block">
              {displayInfo?.titleName || title.titleInfo?.titleName}
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center -space-x-2 flex-shrink-0 py-1 px-1">
          {visibleParticipations.map((p) => {
            const member = usersCache[p.userId];
            if (!member) return null;

            return (
              <div
                key={p.userId}
                className={cn(
                  "relative flex items-center justify-center rounded-full border-2 bg-card transition-transform hover:z-20 hover:scale-110",
                  getStatusBorderClass(p.status)
                )}
                title={`${member.name} (${p.status ?? "No status"})`}
              >
                <UserAvatar
                  src={member.img ?? undefined}
                  name={member.name}
                  size="xs"
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

        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="flex sm:hidden items-center -space-x-2 flex-shrink-0 py-0.5 w-[76px]">
              {visibleParticipations.map((p) => {
                const member = usersCache[p.userId];
                if (!member) return null;

                return (
                  <div
                    key={p.userId}
                    className={cn(
                      "relative flex items-center justify-center rounded-full border-2 bg-card transition-transform",
                      getStatusBorderClass(p.status)
                    )}
                    title={`${member.name} (${p.status ?? "No status"})`}
                  >
                    <UserAvatar
                      src={member.img ?? undefined}
                      name={member.name}
                      size="xs"
                    />
                  </div>
                );
              })}

              {extraCount > 0 && (
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-[9px] font-bold border-2 border-border z-10">
                  +{extraCount}
                </div>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              <ReadOnlyStatusBadge
                status={title.myStatus}
                showDot={false}
              />
            </div>

            <div className="flex items-center justify-end flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <CompactRatingLabel rating={title.computedAvgRating} />
            </div>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-muted/40 hover:bg-muted text-muted-foreground transition-colors font-bold text-lg pb-1 cursor-pointer"
                  aria-label="Actions"
                >
                  <MoreHorizIcon />
                </button>
              }
              align="end"
            >
              <DropdownItem
                onClick={handleOpenDetailsModal}
                icon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              >
                View details & links
              </DropdownItem>

              {isMember && (
                <DropdownItem
                  onClick={handleGoToLinks}
                  icon={<LinkIcon sx={{ fontSize: 16 }} />}
                >
                  Go to links
                </DropdownItem>
              )}
            </Dropdown>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-2 bg-card/95 backdrop-blur-sm border border-border/60 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 ml-0 sm:ml-8 w-full sm:w-[calc(100%-2rem)] shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_90px_19px_40px] items-center px-3 gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border/40">
            <span>Room Member</span>
            <span className="text-center">Status</span>
            <span className="text-center">Rating</span>
            <span />
          </div>

          {participations.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-6">No participation yet.</div>
          ) : (
            <div className="flex flex-col gap-1">
              {participations.map((participation) => {
                const member = usersCache[participation.userId];

                if (!member) return null;

                return (
                  <TitleLinkMember
                    key={participation.userId}
                    member={member}
                    rating={participation.overallRating}
                    status={participation.status}
                    titleId={participation.titleId}
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