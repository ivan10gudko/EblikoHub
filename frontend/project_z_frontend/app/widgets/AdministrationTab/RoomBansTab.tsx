import React, { useState, useRef, useEffect } from 'react';
import { RoomBanCard } from './RoomBanCard';
import { notify } from "~/shared/lib";
import { UserSearchDropdown } from '~/entities/user/ui/UserSearchDropdownResults';
import SearchBar from '~/shared/ui/SearchBar';
import { useDebounce } from '~/shared/hooks';
import { 
    RoomBanDetailsModal, 
    useInfiniteRoomBanSearch,
    useRoomBans, 
    type RoomBanDetailsDto 
} from '~/features/manageRoomBans';
import { useCreateRoomBan } from '~/features/manageRoomBans/hooks/useCreateRoomBan';
import { useDeleteRoomBan } from '~/features/manageRoomBans/hooks/useDeleteRoomBan';
import type { UserShort } from '~/entities/user/model/user.types';


interface RoomBansTabProps {
    roomId: number;
}

export const RoomBansTab = ({ roomId }: RoomBansTabProps) => {
    const [targetUsername, setTargetUsername] = useState('');
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [selectedUserData, setSelectedUserData] = useState<UserShort | null>(null);
    const [reason, setReason] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const [selectedBan, setSelectedBan] = useState<RoomBanDetailsDto | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        data: bannedUsers = [],
        isLoading: isLoadingBans
    } = useRoomBans(roomId);

    const debouncedUsername = useDebounce(targetUsername.trim(), 300);
    const isSearchEnabled = debouncedUsername.length >= 2;

    const {
        data: searchData,
        isLoading: isSearching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteRoomBanSearch(roomId, {
        name: debouncedUsername,
        limit: 10
    }, isSearchEnabled);

    const rawSearchResults = searchData?.pages.flatMap((page) => page.content) || [];

    const filteredSearchResults = rawSearchResults.filter(
        (user) => !bannedUsers.some((ban) => ban.user.userId === user.userId)
    );

    const { mutate: banUser, isPending: isBanning } = useCreateRoomBan(roomId);
    const { mutate: unbanUser, isPending: isUnbanning } = useDeleteRoomBan(roomId);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleBanUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (!targetUserId) {
            notify.error("Please select a valid user from the dropdown list.");
            return;
        }

        banUser(
            {
                userId: targetUserId,
                reason: reason.trim() ? reason.trim() : "Banned by Admin",
                userData: selectedUserData || undefined,
            },
            {
                onSuccess: () => {
                    setTargetUsername('');
                    setTargetUserId(null);
                    setSelectedUserData(null);
                    setReason('');
                    setShowDropdown(false);
                },
            }
        );
    };

    const selectUserFromSearch = (user: UserShort) => {
        setTargetUsername(user.name);
        setTargetUserId(user.userId);
        setSelectedUserData(user);
        setShowDropdown(false);
    };

    const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;

        if (
            target.scrollHeight - target.scrollTop <=
            target.clientHeight + 10
        ) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

    return (
        <div className="p-6 text-foreground flex flex-col gap-6 w-full min-w-0 overflow-hidden">
            <div>
                <h3 className="text-lg font-bold tracking-wide text-foreground truncate">
                    Administration: Room Blacklist
                </h3>
                <p className="text-xs text-foreground-muted mt-1">
                    Manage users blocked from entering this room. You can search and ban room members.
                </p>
            </div>

            <form
                onSubmit={handleBanUser}
                className="p-4 bg-card/30 border border-border rounded-xl backdrop-blur-md relative z-30 w-full min-w-0"
            >
                <div
                    className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 items-start min-w-0"
                    ref={dropdownRef}
                >
                    <div className="relative min-w-0">
                        <SearchBar
                            initialValue={targetUsername}
                            placeholder="Type to search and select a user..."
                            isLoading={isSearching}
                            minLength={2}
                            className="w-full max-w-none"
                            onSearch={(query) => {
                                setTargetUsername(query);
                                if (!query) {
                                    setTargetUserId(null);
                                    setSelectedUserData(null);
                                }
                            }}
                            onChange={(value) => {
                                setTargetUsername(value);
                                setTargetUserId(null);
                                setSelectedUserData(null);
                                setShowDropdown(true);
                            }}
                        />
                        <div onClick={() => setShowDropdown(true)}>
                            {showDropdown && isSearchEnabled && (
                                <div className="absolute left-0 right-0 top-full mt-2 z-[9999] w-full min-w-0">
                                    <UserSearchDropdown
                                        results={filteredSearchResults}
                                        mapToDisplayItem={(user) => ({
                                            userId: user.userId,
                                            name: user.name,
                                            nameTag: user.nameTag || '',
                                            img: user.img || undefined,
                                        })}
                                        onSelect={selectUserFromSearch}
                                        onClose={() => setShowDropdown(false)}
                                        isLoading={isSearching}
                                        compact
                                        onScroll={handleDropdownScroll}
                                        isFetchingNextPage={isFetchingNextPage}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative w-full min-w-0 sm:col-start-1 sm:row-start-2">
                        <input
                            type="text"
                            placeholder="Reason for ban (optional)..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            disabled={isBanning}
                            className="
                                w-full min-w-0
                                px-4 py-2 pr-14 text-xs
                                bg-background/50
                                border border-border/60
                                focus:border-primary/40
                                rounded-xl
                                text-foreground-muted
                                placeholder:text-foreground-muted/40
                                outline-none
                                transition-colors
                                disabled:opacity-50
                            "
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isBanning || !targetUserId}
                        className="
                            bg-primary text-background hover:bg-primary-hover 
                            h-10 px-5 rounded-xl shadow-lg active:scale-95 transition-all 
                            shrink-0 font-black uppercase text-[11px] tracking-wider 
                            border-2 border-primary/30 hover:border-primary/60 
                            cursor-pointer disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100
                            w-full sm:w-auto sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:self-stretch flex items-center justify-center
                        "
                    >
                        {isBanning ? 'Banning...' : 'Ban User'}
                    </button>
                </div>
            </form>

            <div className="flex flex-col min-w-0 w-full relative z-10 overflow-hidden">
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
                    <div className="flex flex-col gap-1 w-full min-w-0 overflow-hidden">
                        {bannedUsers.map((ban) => (
                            <RoomBanCard
                                key={ban.id}
                                banDetails={ban}
                                onUnban={unbanUser}
                                onClick={() => setSelectedBan(ban)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <RoomBanDetailsModal
                isOpen={!!selectedBan}
                onClose={() => setSelectedBan(null)}
                banDetails={selectedBan}
                onUnban={unbanUser}
                isUnbanning={isUnbanning}
            />
        </div>
    );
};