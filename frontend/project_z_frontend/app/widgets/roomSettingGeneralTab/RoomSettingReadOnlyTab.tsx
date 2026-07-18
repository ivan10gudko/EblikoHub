import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleIcon from "@mui/icons-material/People";
import type { Room } from "~/entities/room";

interface RoomSettingReadOnlyTabProps {
  room: Room;
}

export const RoomSettingGeneralReadOnlyTab = ({ room }: RoomSettingReadOnlyTabProps) => {
  const formattedDate = room?.createdAt
    ? new Date(room.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "";

  return (
    /* Ширина залишається компактною (max-w-xl), як і була */
    <div className="w-full max-w-xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden text-left transition-all">
      
      {/* Висоту суттєво збільшено донизу (h-72 / md:h-80), щоб фото мало значно більше місця */}
      <div className="relative w-full h-72 md:h-80 bg-background-muted border-b border-border overflow-hidden flex items-center justify-center group">
        {room?.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.roomName || "Room Cover"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 opacity-30">
            <InfoOutlinedIcon sx={{ fontSize: 32, color: "#ffa31a" }} />
            <span className="text-[10px] tracking-widest uppercase font-semibold text-foreground">
              No Cover Image
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-40" />
      </div>

      <div className="px-6 py-4 bg-card border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <InfoIcon sx={{ color: "#ffa31a", fontSize: 20 }} />
          <h3 className="text-lg font-bold text-foreground tracking-wide">
            {room?.roomName || "Unnamed Space"}
          </h3>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="flex flex-col gap-2 bg-background-muted p-4 rounded-xl border border-border shadow-inner">
          <span className="text-[10px] font-bold text-foreground-muted/60 uppercase tracking-widest">
            Description
          </span>
          <p className="text-sm text-foreground leading-relaxed font-medium whitespace-pre-wrap">
            {room?.description || (
              <span className="text-foreground-muted/40 italic font-normal">
                No description available for this room.
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-border">
          <div className="flex items-center gap-1.5 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
            <ShieldIcon sx={{ fontSize: 16 }} />
            <span>Meta Information</span>
          </div>

          <div className="flex justify-between items-center py-2.5 px-1 border-b border-border/40">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
              <PeopleIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <span>Total Members</span>
            </div>
            <span className="text-xs text-foreground font-bold tracking-wide">
              {room?.members?.length || 0} members
            </span>
          </div>

          <div className="flex justify-between items-center py-2.5 px-1 border-b border-border/40">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground-muted">
              <CalendarMonthIcon sx={{ fontSize: 16, opacity: 0.7 }} />
              <span>Created At</span>
            </div>
            <span className="text-xs text-foreground font-bold tracking-wide">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};