import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import Modal from "~/shared/ui/Modal/Modal";
import { apiClient } from "~/shared/api";
import type {
    SuggestedTitleLinkDto,
    RoomTitleLinkBatchCreateDto
} from "~/features/manageRooms/model/roomTitle.types";
import { Checkbox } from "~/shared/ui/CheckBox";

interface AiTitleMatcherModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: number;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const AiTitleMatcherModal = ({
    isOpen,
    onClose,
    roomId,
}: AiTitleMatcherModalProps) => {
    const queryClient = useQueryClient();

    // Ключ у JS-об'єктах завжди string, значення — UUID roomTitle
    const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
    const [highMatchOnly, setHighMatchOnly] = useState<boolean>(false);

    const { data: suggestions = [], isLoading } = useQuery<SuggestedTitleLinkDto[]>({
        queryKey: ["aiTitleSuggestions", roomId],
        queryFn: async () => {
            const res = await apiClient.get<SuggestedTitleLinkDto[]>(`/rooms/${roomId}/links/suggestions`);
            return res.data;
        },
        enabled: isOpen && !!roomId,
        refetchOnWindowFocus: false,
        staleTime: 0,
    });

    const filteredSuggestions = useMemo(() => {
        if (!highMatchOnly) return suggestions;
        return suggestions.filter((sug) => sug.confidence?.toLowerCase() === "high");
    }, [suggestions, highMatchOnly]);

    const toggleSelect = (titleId: number, roomTitleId: string) => {
        const key = String(titleId);
        setSelectedMatches((prev) => {
            const copy = { ...prev };
            if (copy[key]) {
                delete copy[key];
            } else {
                copy[key] = roomTitleId;
            }
            return copy;
        });
    };

    const handleSelectAll = (filteredItems: SuggestedTitleLinkDto[]) => {
        if (Object.keys(selectedMatches).length === filteredItems.length) {
            setSelectedMatches({});
        } else {
            const newSelected: Record<string, string> = {};
            filteredItems.forEach((item) => {
                if (item.title?.titleId !== undefined && item.roomTitle?.id) {
                    newSelected[String(item.title.titleId)] = item.roomTitle.id;
                }
            });
            setSelectedMatches(newSelected);
        }
    };

    const syncMutation = useMutation({
        mutationFn: async () => {
            const payload: RoomTitleLinkBatchCreateDto = {
                // ТУТ КЛЮЧОВЕ ВИПРАВЛЕННЯ:
                // Перетворюємо string-ключ об'єкта назад у number для DTO
                links: Object.entries(selectedMatches).map(([titleId, roomTitleId]) => ({
                    titleId: Number(titleId), 
                    roomTitleId: roomTitleId,
                })),
            };
            await apiClient.post(`/rooms/${roomId}/links/batch`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userRoomTitleLinks", roomId] });
            queryClient.invalidateQueries({ queryKey: ["suggestedRoomTitleLinks", roomId] });
            queryClient.invalidateQueries({ queryKey: ["aiTitleSuggestions", roomId] });
            setSelectedMatches({});
            onClose();
        },
    });

    const selectedCount = Object.keys(selectedMatches).length;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="ChatGPT Title Matcher" maxWidth="max-w-4xl">
            <div className="flex flex-col space-y-4 pt-2">

                {/* Шапка модального вікна */}
                <div className="flex items-center justify-between bg-card p-2.5 sm:p-3 border border-border rounded-xl">
                    <div className="flex items-center gap-2">
                        <AutoAwesomeIcon className="text-amber-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">AI Analysis & Sync</span>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Checkbox
                            label="High Confidence Only"
                            checked={highMatchOnly}
                            onChange={(checked) => setHighMatchOnly(checked)}
                            labelClassName="text-xs text-muted-foreground font-medium"
                        />

                        {filteredSuggestions.length > 0 && (
                            <button
                                type="button"
                                onClick={() => handleSelectAll(filteredSuggestions)}
                                className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm select-none"
                            >
                                {selectedCount === filteredSuggestions.length ? "Deselect All" : "Select All"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Список підказок */}
                <div className="custom-scrollbar max-h-[60vh] min-h-[300px] overflow-y-auto space-y-2 pr-1">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-48 text-muted-foreground gap-2">
                            <AutoAwesomeIcon className="text-amber-500 text-3xl animate-spin" />
                            <span className="text-xs sm:text-sm font-medium">ChatGPT is analyzing similarities...</span>
                        </div>
                    ) : filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => {
                            const currentTitleId = item.title.titleId;
                            const currentRoomTitleId = item.roomTitle.id;
                            const userTitleName = item.title.titleName;
                            const roomTitleName = item.roomTitle.titleName;

                            const userImageUrl = item.title.imageUrl || DEFAULT_IMAGE_PATH;
                            const roomImageUrl = item.roomTitle.imageUrl || DEFAULT_IMAGE_PATH;

                            // Явно перевіряємо через String(), оскільки ключ об'єкта завжди string
                            const isChecked = !!selectedMatches[String(currentTitleId)];
                            const confidence = item.confidence?.toLowerCase() || "medium";

                            const badgeBg =
                                confidence === "high"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : confidence === "medium"
                                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        : "bg-muted text-muted-foreground border-border";

                            return (
                                <div
                                    key={`${currentTitleId}-${currentRoomTitleId}`}
                                    onClick={() => toggleSelect(currentTitleId, currentRoomTitleId)}
                                    className={`group/row grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3 p-2 sm:p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                                        isChecked
                                            ? "bg-primary/5 border-primary shadow-sm"
                                            : "bg-card border-border hover:border-border/80"
                                    }`}
                                >
                                    {/* 1. Чекбокс */}
                                    <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={() => toggleSelect(currentTitleId, currentRoomTitleId)}
                                        />
                                    </div>

                                    {/* 2. Watchlist Item */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative h-10 w-16 shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-20 cursor-pointer">
                                            <img
                                                src={userImageUrl}
                                                alt={userTitleName}
                                                className="absolute inset-0 h-full w-full object-cover rounded-md border border-border/50"
                                            />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-foreground uppercase text-xs sm:text-sm truncate leading-tight">
                                                {userTitleName}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">My Watchlist</span>
                                        </div>
                                    </div>

                                    {/* 3. Стрілка */}
                                    <div className="flex items-center justify-center shrink-0 px-1">
                                        <span className="text-xs text-muted-foreground/60 font-bold">➔</span>
                                    </div>

                                    {/* 4. Room Title Item */}
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        <div className="relative h-10 w-16 shrink-0 transition-transform duration-500 hover:scale-[3.0] hover:z-20 cursor-pointer">
                                            <img
                                                src={roomImageUrl}
                                                alt={roomTitleName}
                                                className="absolute inset-0 h-full w-full object-cover rounded-md border border-border/50"
                                            />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="font-bold text-foreground uppercase text-xs sm:text-sm truncate leading-tight">
                                                {roomTitleName}
                                            </span>
                                            <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">Room Title</span>
                                        </div>
                                    </div>

                                    {/* 5. Бейдж */}
                                    <div className="flex items-center justify-end shrink-0">
                                        <div className={`w-[80px] py-1 text-center rounded-lg text-[10px] sm:text-xs font-bold border uppercase tracking-wider ${badgeBg}`}>
                                            {confidence}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex justify-center items-center h-40 text-muted-foreground text-xs sm:text-sm font-medium">
                            No matching suggestions found.
                        </div>
                    )}
                </div>

                {/* Футер */}
                <div className="pt-3 border-t border-border flex gap-2">
                    <button
                        onClick={() => syncMutation.mutate()}
                        disabled={selectedCount === 0 || syncMutation.isPending}
                        className="flex-1 py-2.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <AutoAwesomeIcon className="text-sm" />
                        Sync Selected ({selectedCount})
                    </button>

                    <button
                        onClick={onClose}
                        className="py-2.5 px-5 bg-transparent hover:bg-muted border border-border text-foreground rounded-xl font-bold uppercase text-xs sm:text-sm tracking-wider transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    );
};