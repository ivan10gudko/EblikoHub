import type { UserProfile } from "~/entities/user";

export type TabType = "friends" | "add" | "pending" | "sent";

export interface PendingFriendRequest extends UserProfile {
    friendshipId?: string;
}