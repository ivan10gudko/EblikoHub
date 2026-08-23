import { useState, useMemo, useEffect, useCallback } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { SuggestedTitleLinkDto } from "~/features/manageRoomTitles/model/roomTitle.types";
import { Checkbox } from "~/shared/ui/CheckBox";
import Button from "~/shared/ui/Button/Button";
import { TitleType, TitleTypeBorderColors, TitleTypeGradientColors } from "~/entities/titleRecord";
import { useAiTitleSuggestions } from "~/features/manageRoomTitles/hooks/useAiTitleSuggestions";
import { useBatchCreateRoomTitleLinks } from "~/features/manageRoomTitles/hooks/useBatchCreateRoomTitleLinks";
import { useNavigate, useParams } from "react-router";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { useWindowDimensions } from "~/shared/hooks";

const getActiveBorder = (type?: TitleType, fallback = "rgba(255,255,255,0.8)") => {
    if (!type || !TitleTypeBorderColors[type]) return fallback;
    return TitleTypeBorderColors[type].replace(/[\d.]+\)$/, "0.95)");
};

const getBadgeBgClass = (confidence?: string) => {
    const conf = confidence?.toLowerCase();
    if (conf === "high") return "bg-green-500/10 text-green-500 border border-green-500/20";
    if (conf === "medium") return "bg-primary/10 text-primary border border-primary/30";
    return "bg-muted text-muted-foreground border border-border";
};

const buildCardStyle = (
    userTitleType: TitleType,
    roomTitleType: TitleType,
    isChecked: boolean,
    isMobile: boolean
): React.CSSProperties => {
    const leftBg = userTitleType ? TitleTypeGradientColors[userTitleType] : "transparent";
    const rightBg = roomTitleType ? TitleTypeGradientColors[roomTitleType] : "transparent";

    const defaultLeftBorder = userTitleType ? TitleTypeBorderColors[userTitleType] : "rgba(255,255,255,0.15)";
    const defaultRightBorder = roomTitleType ? TitleTypeBorderColors[roomTitleType] : "rgba(255,255,255,0.15)";

    const activeLeftBorder = getActiveBorder(userTitleType);
    const activeRightBorder = getActiveBorder(roomTitleType);

    const currentLeftBorder = isChecked ? activeLeftBorder : defaultLeftBorder;
    const currentRightBorder = isChecked ? activeRightBorder : defaultRightBorder;

    const gradientAngle = isMobile ? "180deg" : "90deg";

    return {
        backgroundImage: `
            linear-gradient(${gradientAngle}, ${leftBg} 0%, transparent 45%, transparent 55%, ${rightBg} 100%),
            linear-gradient(var(--card, #121212), var(--card, #121212)),
            linear-gradient(${gradientAngle}, ${currentLeftBorder} 0%, ${isChecked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"} 40%, ${isChecked ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.05)"} 60%, ${currentRightBorder} 100%)
        `,
        backgroundOrigin: "padding-box, padding-box, border-box",
        backgroundClip: "padding-box, padding-box, border-box",
        boxShadow: isChecked ? `0 0 6px ${currentLeftBorder}, 0 0 6px ${currentRightBorder}` : "none",
    };
};


export const AiTitleMatcherPage = () => {
    const { id } = useParams<{ id: string }>();
    const numericRoomId = Number(id);
    const navigate = useNavigate();

    const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({});
    const [highMatchOnly, setHighMatchOnly] = useState<boolean>(false);
    const [hasRequested, setHasRequested] = useState<boolean>(false);

    const breakpoint = useWindowDimensions();
    const isMobile = breakpoint === 'xs' || breakpoint === 'sm';

    const {
        data: suggestions = [],
        isLoading,
        isFetching,
        refetch
    } = useAiTitleSuggestions(numericRoomId);

    const syncMutation = useBatchCreateRoomTitleLinks({
        roomId: numericRoomId,
        onSuccess: () => {
            setSelectedMatches({});
            navigate(-1);
        },
    });

    const handleGenerateSuggestions = useCallback(() => {
        setHasRequested(true);
        setSelectedMatches({});
        refetch();
    }, [refetch]);

    const handleSync = useCallback(() => {
        const payload = {
            links: Object.entries(selectedMatches).map(([titleId, roomTitleId]) => ({
                titleId: Number(titleId),
                roomTitleId: roomTitleId,
            })),
        };
        syncMutation.mutate(payload);
    }, [selectedMatches, syncMutation]);

    const filteredSuggestions = useMemo(() => {
        if (!highMatchOnly) return suggestions;
        return suggestions.filter((sug) => sug.confidence?.toLowerCase() === "high");
    }, [suggestions, highMatchOnly]);

    const isAllFilteredSelected = useMemo(() => {
        if (filteredSuggestions.length === 0) return false;
        return filteredSuggestions.every(
            (item) => item.title?.titleId !== undefined && !!selectedMatches[item.title.titleId]
        );
    }, [filteredSuggestions, selectedMatches]);

    const toggleSelect = useCallback((titleId: number, roomTitleId: string) => {
        setSelectedMatches((prev) => {
            const copy = { ...prev };
            if (copy[titleId]) {
                delete copy[titleId];
            } else {
                copy[titleId] = roomTitleId;
            }
            return copy;
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        if (isAllFilteredSelected) {
            setSelectedMatches((prev) => {
                const copy = { ...prev };
                filteredSuggestions.forEach((item) => {
                    if (item.title?.titleId !== undefined) {
                        delete copy[item.title.titleId];
                    }
                });
                return copy;
            });
        } else {
            setSelectedMatches((prev) => {
                const next = { ...prev };
                filteredSuggestions.forEach((item) => {
                    if (item.title?.titleId !== undefined && item.roomTitle?.id) {
                        next[item.title.titleId] = item.roomTitle.id;
                    }
                });
                return next;
            });
        }
    }, [filteredSuggestions, isAllFilteredSelected]);

    const selectedCount = useMemo(() => Object.keys(selectedMatches).length, [selectedMatches]);
    const isBusy = isLoading || isFetching;

    return (
        <div className="w-full max-w-4xl space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-3">
                <div className="space-y-1">
                    <h1 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
                        <AutoAwesomeIcon className="text-primary text-xl sm:text-2xl" />
                        AI Title Matcher
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Automatic title matching and synchronization for your room
                    </p>
                </div>

                <div className="w-full sm:w-auto">
                    <Button
                        onClick={handleSync}
                        disabled={selectedCount === 0 || syncMutation.isPending}
                        variant="save"
                        className="w-full sm:w-auto justify-center"
                    >
                        <AutoAwesomeIcon className="text-sm" />
                        Sync Selected ({selectedCount})
                    </Button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-card p-3 border-2 border-border rounded-xl gap-3">
                <div className="flex items-center gap-2">
                    <AutoAwesomeIcon className="text-primary animate-pulse text-sm" />
                    <span className="text-xs sm:text-sm font-bold tracking-wide">AI Analysis and Sync</span>
                </div>

                <div className="flex flex-col xs:flex-row sm:flex-row items-stretch xs:items-center gap-2.5 sm:gap-4 flex-wrap">
                    <Button
                        onClick={handleGenerateSuggestions}
                        disabled={isBusy}
                        className="text-xs justify-center w-full h-10 md:h-12 md:w-56 xs:w-auto"
                    >
                        <AutoAwesomeIcon className={`text-xs ${isBusy ? "animate-spin" : ""}`} />
                        {isBusy ? "Analyzing..." : hasRequested ? "Re-generate Matches" : "Find AI Matches"}
                    </Button>

                    <div className="flex items-center justify-between gap-3 min-w-0">
                        <Checkbox
                            label="High Confidence Only"
                            checked={highMatchOnly}
                            onChange={(checked) => setHighMatchOnly(checked)}
                            labelClassName="text-xs text-muted-foreground font-medium cursor-pointer whitespace-nowrap"
                        />

                        {filteredSuggestions.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 border-2 border-primary/30 rounded-lg transition-all active:scale-95 cursor-pointer shadow-sm select-none whitespace-nowrap shrink-0"
                            >
                                {isAllFilteredSelected ? "Deselect All" : "Select All"}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {!hasRequested && !isBusy ? (
                    <div className="flex flex-col justify-center items-center h-64 border-2 border-dashed border-border rounded-2xl text-muted-foreground gap-4 p-6 text-center">
                        <AutoAwesomeIcon className="text-primary text-5xl" />
                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-foreground">Find title matches with AI</h3>
                            <p className="text-xs text-muted-foreground max-w-md">
                                Click the button below to generate AI recommendations and link titles between your watchlist and room.
                            </p>
                        </div>
                        <Button onClick={handleGenerateSuggestions} variant="save" className="w-full sm:w-auto justify-center">
                            <AutoAwesomeIcon className="text-sm" />
                            Start AI Title Matching
                        </Button>
                    </div>
                ) : isBusy ? (
                    <div className="flex flex-col justify-center items-center h-64 border-2 border-dashed border-border rounded-2xl text-muted-foreground gap-3">
                        <AutoAwesomeIcon className="text-primary text-4xl animate-spin" />
                        <span className="text-sm font-medium">ChatGPT is analyzing similarities...</span>
                    </div>
                ) : filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((item) => (
                        <SuggestionCard
                            key={`${item.title.titleId}-${item.roomTitle.id}`}
                            item={item}
                            isChecked={!!selectedMatches[String(item.title.titleId)]}
                            isMobile={isMobile}
                            onToggle={toggleSelect}
                        />
                    ))
                ) : (
                    <div className="flex justify-center items-center h-48 border-2 border-dashed border-border rounded-2xl text-muted-foreground text-xs sm:text-sm font-medium">
                        No matching suggestions found.
                    </div>
                )}
            </div>
        </div>
    );
};
interface SuggestionCardProps {
    item: SuggestedTitleLinkDto;
    isChecked: boolean;
    isMobile: boolean;
    onToggle: (titleId: number, roomTitleId: string) => void;
}

const SuggestionCard = ({ item, isChecked, isMobile, onToggle }: SuggestionCardProps) => {
    const currentTitleId = item.title.titleId;
    const currentRoomTitleId = item.roomTitle.id;
    const userTitleName = item.title.titleName;
    const roomTitleName = item.roomTitle.titleName;

    const userImageUrl = item.title.imageUrl || DEFAULT_IMAGE_PATH;
    const roomImageUrl = item.roomTitle.imageUrl || DEFAULT_IMAGE_PATH;

    const confidence = item.confidence?.toLowerCase() || "medium";
    const userTitleType = item.title.type as TitleType;
    const roomTitleType = item.roomTitle.titleType as TitleType;

    const cardStyle = useMemo(
        () => buildCardStyle(userTitleType, roomTitleType, isChecked, isMobile),
        [userTitleType, roomTitleType, isChecked, isMobile]
    );

    const badgeBg = getBadgeBgClass(confidence);
    return (
        <div
            onClick={() => onToggle(currentTitleId, currentRoomTitleId)}
            style={cardStyle}
            className={`group/row p-3 rounded-xl border-2 border-transparent bg-card cursor-pointer transition-all duration-200 ${isChecked ? "scale-[1.005]" : ""
                }`}
        >
            <div className="flex flex-col md:grid md:grid-cols-[auto_1fr_auto_1fr_auto] items-stretch md:items-center gap-3">
                <div className="flex items-center justify-between md:contents">
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
                        <Checkbox
                            checked={isChecked}
                            onChange={() => onToggle(currentTitleId, currentRoomTitleId)}
                        />
                    </div>

                    <div className="md:hidden flex items-center shrink-0">
                        <div className={`px-2.5 py-1 text-center rounded-lg text-[10px] font-bold uppercase tracking-wider ${badgeBg}`}>
                            {confidence}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-12 w-16 sm:w-20 shrink-0">
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
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">
                            My Watchlist {userTitleType && `• ${userTitleType}`}
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center shrink-0 py-0.5 md:py-0 md:px-2">
                    <span className="text-xs text-muted-foreground/60 font-bold rotate-90 md:rotate-0">➔</span>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative h-12 w-16 sm:w-20 shrink-0">
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
                        <span className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">
                            Room Title {roomTitleType && `• ${roomTitleType}`}
                        </span>
                    </div>
                </div>

                <div className="hidden md:flex items-center justify-end shrink-0">
                    <div className={`w-[80px] py-1 text-center rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider ${badgeBg}`}>
                        {confidence}
                    </div>
                </div>
            </div>
        </div>
    );
};