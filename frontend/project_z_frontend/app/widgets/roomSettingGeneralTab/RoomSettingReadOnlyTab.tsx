import React from "react";
import InfoIcon from "@mui/icons-material/Info";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ShieldIcon from "@mui/icons-material/Shield";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { Room } from "~/entities/room";
import PeopleIcon from "@mui/icons-material/People";

interface RoomSettingReadOnlyTabProps {
    room: Room;
}

export const RoomSettingReadOnlyTab: React.FC<RoomSettingReadOnlyTabProps> = ({ room }) => {
    const formattedDate = room?.createdAt
        ? new Date(room.createdAt).toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" })
        : "";

    return (
        <div className="w-full max-w-xl bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden text-left transition-all">

            {/* 1. Обкладинка (банер) з фіксованою невеликою висотою */}
            <div className="relative w-full h-32 bg-[var(--background-muted)] border-b border-[var(--border)] overflow-hidden flex items-center justify-center group">
                {room?.imageUrl ? (
                    <img
                        src={room.imageUrl}
                        alt={room.roomName || "Room Cover"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                ) : (
                    // Компактний плейсхолдер для порожньої обкладинки
                    <div className="flex flex-col items-center gap-1.5 opacity-30">
                        <InfoOutlinedIcon sx={{ fontSize: 32, color: "var(--primary)" }} />
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-[var(--foreground)]">
                            No Cover Image
                        </span>
                    </div>
                )}

                {/* Легке затемнення знизу */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)]/90 via-transparent to-transparent opacity-40" />
            </div>

            {/* 2. Шапка під банером */}
            <div className="px-6 py-4 bg-[var(--card)] border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <InfoIcon sx={{ color: "var(--primary)", fontSize: 20 }} />
                    <h3 className="text-lg font-bold text-[var(--foreground)] tracking-wide">
                        {room?.roomName || "Unnamed Space"}
                    </h3>
                </div>
            </div>

            {/* 3. Контентна частина */}
            <div className="p-6 flex flex-col gap-5">

                {/* Поле: Опис кімнати */}
                <div className="flex flex-col gap-2 bg-[var(--background-muted)] p-4 rounded-xl border border-[var(--border)] shadow-inner">
                    <span className="text-[10px] font-bold text-[var(--foreground-muted)]/60 uppercase tracking-widest">
                        Description
                    </span>
                    <p className="text-sm text-[var(--foreground)] leading-relaxed font-medium whitespace-pre-wrap">
                        {room?.description || (
                            <span className="text-[var(--foreground-muted)]/40 italic font-normal">
                                No description available for this room.
                            </span>
                        )}
                    </p>
                </div>

                {/* Системні мета-дані */}
                <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1.5 text-[var(--primary)] font-semibold text-xs uppercase tracking-wider mb-1">
                        <ShieldIcon sx={{ fontSize: 16 }} />
                        <span>Meta Information</span>
                    </div>

                    {/* Кількість учасників */}
                    <div className="flex justify-between items-center py-2.5 px-1 border-b border-[var(--border)]/40">
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-muted)]">
                            <PeopleIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                            <span>Total Members</span>
                        </div>
                        <span className="text-xs text-[var(--foreground)] font-bold tracking-wide">
                            {room?.members?.length || 0} members
                        </span>
                    </div>

                    {/* Дата створення */}
                    <div className="flex justify-between items-center py-2.5 px-1 border-b border-[var(--border)]/40">
                        <div className="flex items-center gap-2 text-xs font-medium text-[var(--foreground-muted)]">
                            <CalendarMonthIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                            <span>Created At</span>
                        </div>
                        <span className="text-xs text-[var(--foreground)] font-bold tracking-wide">
                            {formattedDate}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
};