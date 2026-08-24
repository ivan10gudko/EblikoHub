import { useSuspenseQuery } from "@tanstack/react-query";
import type { WithFriendship } from "~/entities/friendship";
import { friendshipService } from "~/entities/friendship/api/friendshipService";
import { userService } from "~/entities/user/api/UserService";
import type { UserProfile } from "~/entities/user/model/user.types";

interface UseFriendProfileProps {
    userId: string;
    isOwn: boolean;
    profileQueryKey: string[];
}

export const useProfileQuery = ({
    userId,
    isOwn,
    profileQueryKey,
}: UseFriendProfileProps) => {

    const { data: user } = useSuspenseQuery<WithFriendship<UserProfile>>({
        queryKey: profileQueryKey,
        queryFn: async (): Promise<WithFriendship<UserProfile>> => {
            if (isOwn) {
                const profile = await userService.getUser(userId);
                return {
                    ...profile,
                    friendshipStatus: null,
                    friendshipId: null,
                };
            }
            return friendshipService.getUserWithFriendshipStatus<UserProfile>(userId);
        },
    });

    return {
        user,
    }
}