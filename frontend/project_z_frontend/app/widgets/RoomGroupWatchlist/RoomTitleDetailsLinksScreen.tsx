import type { RoomTitleWithLinksDto } from "../../features/manageRoomTitles/model/roomTitle.types";
import { ViewRoomTitleDetailsScreen } from "../../features/manageRoomTitles/ui/Modals/ViewRoomTitleDetailsScreen";
import { TitleLinkMember } from "../../features/manageRoomTitles/ui/TitleLinkMember";

interface RoomTitleDetailsModalProps {
  data: RoomTitleWithLinksDto;
  onEdit?: () => void;
}

export const RoomTitleDetailsLinksScreen = ({ data, onEdit }: RoomTitleDetailsModalProps) => {
  const { roomTitle, links } = data;

  return (
    
    <div className="flex flex-col lg:flex-row gap-2 w-full">
      <ViewRoomTitleDetailsScreen
        roomTitle={roomTitle}
        onEdit={onEdit}
      />

      <div className="w-full lg:w-[440px] flex flex-col p-4 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between mb-4 px-1 shrink-0">
          <h3 className="text-lg font-bold">Room Members</h3>
          <span className="text-sm text-foreground-muted">{links.length} members</span>
        </div>

        <div className="flex flex-col gap-1 flex-1 min-h-[300px] max-h-[420px] overflow-y-auto custom-scrollbar">
          {links.map((link, idx) => {

            return (
              <TitleLinkMember
                key={idx}
                member={link.owner}
                rating={link.title.rating?.overall ?? null}
                status={link.title.status}
                titleId={link.title.titleId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};