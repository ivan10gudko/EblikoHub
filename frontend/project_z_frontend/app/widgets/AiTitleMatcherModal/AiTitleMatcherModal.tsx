import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { apiClient } from "~/shared/api";
import type {
    SuggestedTitleLinkDto,
    RoomTitleLinkBatchCreateDto
} from "~/features/manageRooms/model/roomTitle.types";
import { Checkbox } from "~/shared/ui/CheckBox";
import Button from "~/shared/ui/Button/Button";
import { TitleType, TitleTypeBorderColors, TitleTypeGradientColors } from "~/entities/titleRecord";

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const AiTitleMatcherPage = () => {
    const { id } = useParams<{ id: string }>();
    const numericRoomId = Number(id);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
    const [highMatchOnly, setHighMatchOnly] = useState<boolean>(false);

    const { data: suggestions = [], isLoading } = useQuery<SuggestedTitleLinkDto[]>({
        queryKey: ["aiTitleSuggestions", numericRoomId],
        queryFn: async () => {
            const res = await apiClient.get<SuggestedTitleLinkDto[]>(`/rooms/${numericRoomId}/links/suggestions`);
            return res.data;
        },
        enabled: !!numericRoomId,
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
                links: Object.entries(selectedMatches).map(([titleId, roomTitleId]) => ({
                    titleId: Number(titleId), 
                    roomTitleId: roomTitleId,
                })),
            };
            await apiClient.post(`/rooms/${numericRoomId}/links/batch`, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userRoomTitleLinks", numericRoomId] });
            queryClient.invalidateQueries({ queryKey: ["suggestedRoomTitleLinks", numericRoomId] });
            queryClient.invalidateQueries({ queryKey: ["aiTitleSuggestions", numericRoomId] });
            setSelectedMatches({});
            navigate(-1);
        },
    });

    const selectedCount = Object.keys(selectedMatches).length;

    return (
        <div className="w-full max-w-4xl space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-2">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                            <AutoAwesomeIcon className="text-primary" />
                            ChatGPT Title Matcher
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Automatic title matching and synchronization for your room
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={() => navigate(-1)} variant="cancel">
                        Cancel
                    </Button>
                    
                    <Button
                        onClick={() => syncMutation.mutate()}
                        disabled={selectedCount === 0 || syncMutation.isPending}
                        variant="save"
                    >
                        <AutoAwesomeIcon className="text-sm" />
                        Sync Selected ({selectedCount})
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between bg-card p-3 border-2 border-border rounded-xl">
                <div className="flex items-center gap-2">
                    <AutoAwesomeIcon className="text-primary animate-pulse text-sm" />
                    <span className="text-xs sm:text-sm font-bold tracking-wide">AI Analysis and Sync</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <Checkbox
                        label="High Confidence Only"
                        checked={highMatchOnly}
                        onChange={(checked) => setHighMatchOnly(checked)}
                        labelClassName="text-xs text-muted-foreground font-medium cursor-pointer"
                    />

                    {filteredSuggestions.length > 0 && (
                        <button
                            type="button"
                            onClick={() => handleSelectAll(filteredSuggestions)}
                            className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm select-none"
                        >
                            {selectedCount === filteredSuggestions.length ? "Deselect All" : "Select All"}
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center h-64 border-2 border-dashed border-border rounded-2xl text-muted-foreground gap-3">
                        <AutoAwesomeIcon className="text-primary text-4xl animate-spin" />
                        <span className="text-sm font-medium">ChatGPT is analyzing similarities...</span>
                    </div>
                ) : filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => {
                        const currentTitleId = item.title.titleId;
                        const currentRoomTitleId = item.roomTitle.id;
                        const userTitleName = item.title.titleName;
                        const roomTitleName = item.roomTitle.titleName;

                        const userImageUrl = item.title.imageUrl || DEFAULT_IMAGE_PATH;
                        const roomImageUrl = item.roomTitle.imageUrl || DEFAULT_IMAGE_PATH;

                        const isChecked = !!selectedMatches[String(currentTitleId)];
                        const confidence = item.confidence?.toLowerCase() || "medium";

                        const userTitleType = item.title.type as TitleType;
                        const roomTitleType = item.roomTitle.titleType as TitleType;

                        const leftBg = userTitleType ? TitleTypeGradientColors[userTitleType] : "transparent";
                        const rightBg = roomTitleType ? TitleTypeGradientColors[roomTitleType] : "transparent";

                        const leftBorder = userTitleType ? TitleTypeBorderColors[userTitleType] : "rgba(255,255,255,0.15)";
                        const rightBorder = roomTitleType ? TitleTypeBorderColors[roomTitleType] : "rgba(255,255,255,0.15)";

                        
                        const cardStyle: React.CSSProperties = {
                            backgroundImage: `
                                linear-gradient(90deg, ${leftBg} 0%, transparent 45%, transparent 55%, ${rightBg} 100%),
                                linear-gradient(var(--card, #121212), var(--card, #121212)),
                                linear-gradient(90deg, ${leftBorder} 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.05) 60%, ${rightBorder} 100%)
                            `,
                            backgroundOrigin: "padding-box, padding-box, border-box",
                            backgroundClip: "padding-box, padding-box, border-box",
                        };

                        const badgeBg =
                            confidence === "high"
                                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                                : confidence === "medium"
                                    ? "bg-primary/10 text-primary border border-primary/30"
                                    : "bg-muted text-muted-foreground border border-border";

                        return (
                            <div
                                key={`${currentTitleId}-${currentRoomTitleId}`}
                                onClick={() => toggleSelect(currentTitleId, currentRoomTitleId)}
                                style={cardStyle}
                                className={`group/row grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3 p-2 rounded-xl border-2 border-transparent bg-card cursor-pointer transition-all duration-200 ${
                                    isChecked
                                        ? "!border-primary shadow-sm ring-1 ring-primary/40"
                                        : ""
                                }`}
                            >
                                <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
                                    <Checkbox
                                        checked={isChecked}
                                        onChange={() => toggleSelect(currentTitleId, currentRoomTitleId)}
                                    />
                                </div>

                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative h-12 w-20 shrink-0 transition-transform duration-300 hover:scale-[2] hover:z-20 cursor-pointer">
                                        <img
                                            src={userImageUrl}
                                            alt={userTitleName}
                                            className="absolute inset-0 h-full w-full object-cover rounded-md border border-border/50 shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-xs sm:text-sm truncate leading-tight">
                                            {userTitleName}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                            My Watchlist {userTitleType && `• ${userTitleType}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center shrink-0 px-2">
                                    <span className="text-xs text-muted-foreground/60 font-bold">➔</span>
                                </div>

                                <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="relative h-12 w-20 shrink-0 transition-transform duration-500 hover:scale-[2] hover:z-20 cursor-pointer">
                                        <img
                                            src={roomImageUrl}
                                            alt={roomTitleName}
                                            className="absolute inset-0 h-full w-full object-cover rounded-md border border-border/50 shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-bold text-xs sm:text-sm truncate leading-tight">
                                            {roomTitleName}
                                        </span>
                                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                            Room Title {roomTitleType && `• ${roomTitleType}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end shrink-0">
                                    <div className={`w-[80px] py-1 text-center rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider ${badgeBg}`}>
                                        {confidence}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex justify-center items-center h-48 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-xs sm:text-sm font-medium">
                        No matching suggestions found.
                    </div>
                )}
            </div>
        </div>
    );
};