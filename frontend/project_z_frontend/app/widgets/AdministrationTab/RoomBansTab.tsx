import React, { useState, useRef, useEffect } from 'react';
import { RoomBanCard } from './RoomBanCard';
import { UserAvatar } from "~/entities/user";
import { useRoomBans } from '~/features/manageRooms/hooks/useRoomBans';
import { useInfiniteRoomBanSearch } from '~/features/manageRooms';
import { useRoomBanActions } from '~/features/manageRooms/hooks/useRoomBanActions';
import type { RoomBanCreateDto } from '~/features/manageRooms/model/roomTitle.types';
import { notify } from "~/shared/lib";

interface RoomBansTabProps {
    roomId: string | number;
}


function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export const RoomBansTab: React.FC<RoomBansTabProps> = ({ roomId }) => {
    const numericRoomId = Number(roomId);

    
    const [targetUsername, setTargetUsername] = useState('');
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

   
    const { 
        data: bannedUsers = [], 
        isLoading: isLoadingBans 
    } = useRoomBans(numericRoomId);

   
    const debouncedUsername = useDebounce(targetUsername.trim(), 300);
    const isSearchEnabled = debouncedUsername.length >= 2;

    const {
        data: searchData,
        isLoading: isSearching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteRoomBanSearch(numericRoomId, {
        name: debouncedUsername, 
        limit: 10
    }, isSearchEnabled);

    
    const rawSearchResults = searchData?.pages.flatMap((page) => page.content) || [];

   
    const filteredSearchResults = rawSearchResults.filter(
        (user) => !bannedUsers.some((ban) => ban.user.userId === user.userId)
    );

    
    const { banUser, unbanUser, isPending: isMutating } = useRoomBanActions(numericRoomId);

    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

   
    const handleBanUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!targetUserId) {
            notify.error("Please select a valid user from the dropdown list.");
            return;
        }

        const finalReason = reason.trim() ? reason.trim() : "Banned by Admin";

        const payload: RoomBanCreateDto = {
            userId: targetUserId,
            reason: finalReason
        };

        try {
            await banUser(payload);
            
           
            notify.success("User successfully banned");

            setTargetUsername('');
            setTargetUserId(null);
            setReason('');
            setShowDropdown(false);
        } catch {
            
        }
    };

    
    const handleUnbanUser = async (roomBanId: string) => {
        try {
            await unbanUser(roomBanId);
            notify.success("User successfully unbanned");
        } catch {
            
        }
    };

    const selectUserFromSearch = (username: string, userId: string) => {
        setTargetUsername(username);
        setTargetUserId(userId);
        setShowDropdown(false);
    };

    
    const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.scrollHeight - target.scrollTop <= target.clientHeight + 10) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    return (
        <div className="p-6 text-foreground flex flex-col gap-6">
            <div>
                <h3 className="text-lg font-bold tracking-wide text-foreground">
                    Administration: Room Blacklist
                </h3>
                <p className="text-xs text-foreground-muted mt-1">
                    Manage users blocked from entering this room. You can search and ban room members.
                </p>
            </div>

            
            <form onSubmit={handleBanUser} className="flex flex-col gap-3 p-4 bg-card/30 border border-border rounded-xl backdrop-blur-md relative z-30">
                <div className="flex gap-3 relative" ref={dropdownRef}>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type to search and select a user..."
                            value={targetUsername}
                            onChange={(e) => {
                                setTargetUsername(e.target.value);
                                setTargetUserId(null); 
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            disabled={isMutating}
                            className="w-full px-4 py-2.5 text-sm bg-background border border-border focus:border-primary/60 rounded-xl text-foreground placeholder:text-foreground-muted/60 outline-none transition-colors disabled:opacity-50"
                        />

                        
                        {showDropdown && isSearchEnabled && (
                            <div 
                                onScroll={handleDropdownScroll}
                                className="absolute left-0 right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-2xl max-h-48 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-border/60 scrollbar-track-transparent z-[9999]"
                            >
                                {isSearching ? (
                                    <div className="text-xs text-foreground-muted p-4 animate-pulse">Searching users...</div>
                                ) : filteredSearchResults.length === 0 ? (
                                    <div className="text-xs text-foreground-muted/60 p-4 italic">No users found</div>
                                ) : (
                                    <>
                                        {filteredSearchResults.map((user) => (
                                            <div
                                                key={user.userId}
                                                onClick={() => selectUserFromSearch(user.nameTag || user.name, user.userId)}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-primary/10 cursor-pointer transition-colors border-b border-border/40 last:border-none"
                                            >
                                                <UserAvatar name={user.name} src={user.img || undefined} size="sm" />
                                                <div className="flex flex-col min-w-0 py-1">
                                                    <span className="text-sm font-semibold truncate text-foreground">{user.name}</span>
                                                    <span className="text-xs text-primary truncate">@{user.nameTag}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {isFetchingNextPage && (
                                            <div className="text-center py-2 text-xs text-foreground-muted animate-pulse">
                                                Loading more...
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isMutating || !targetUserId}
                        className=" border  border-danger/40 text-white/70 hover:bg-danger/15 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/30 cursor-pointer"
                    >
                        {isMutating ? 'Banning...' : 'Ban User'}
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Reason for ban (optional)..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={isMutating}
                    className="px-4 py-2 text-xs bg-background/50 border border-border/60 focus:border-primary/40 rounded-xl text-foreground-muted placeholder:text-foreground-muted/40 outline-none transition-colors disabled:opacity-50"
                />
            </form>

            
            <div className="flex flex-col min-w-0 relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted mb-3">
                    Banned Users ({bannedUsers.length})
                </h4>

                {isLoadingBans ? (
                    <div className="text-sm text-foreground-muted/70 py-4 animate-pulse">
                        Loading blocklist...
                    </div>
                ) : bannedUsers.length === 0 ? (
                    <div className="text-sm text-foreground-muted/50 italic py-6 text-center border border-dashed border-border rounded-xl bg-card/10">
                        No banned users found in this room.
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        {bannedUsers.map((ban) => (
                            <RoomBanCard
                                key={ban.id}
                                banDetails={ban}
                                onUnban={handleUnbanUser}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};