import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
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
    <div className="flex flex-col w-full max-w-5xl bg-background text-foreground rounded-2xl overflow-hidden shadow-2xl">
      <div className="flex flex-col lg:flex-row p-6 gap-6">
        <ViewRoomTitleDetailsScreen
          roomTitle={roomTitle}
          onEdit={onEdit}
        />

        <div className="w-full lg:w-[420px] flex flex-col p-6 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Room Members</h3>
            <span className="text-sm text-foreground-muted">{links.length} members</span>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-h-[300px] max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {links.map((link, idx) => {
              const rawRating = Object.values(link.title.rating || {})[0];
              const ratingNumber = typeof rawRating === "number" ? rawRating : Number(rawRating) || 0;

              return (
                <TitleLinkMember
                  key={idx}
                  member={link.owner}
                  rating={ratingNumber}
                  status={link.title.status}
                  titleId={link.title.titleId}
                />
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};