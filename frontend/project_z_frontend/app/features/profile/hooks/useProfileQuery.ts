import { useSuspenseQuery } from "@tanstack/react-query";
import { profileService } from "../api/profileService";
import type { UserProfileWithFavorite } from "../model/profile.types";
import type { WithFriendship } from "~/entities/friendship";

interface UseFriendProfileProps {
    userId: string;
    isOwn: boolean;
    profileQueryKey: string[];
}

export const useProfileQuery = ({
    userId,
    profileQueryKey,
}: UseFriendProfileProps) => {

    const { data: user } = useSuspenseQuery<WithFriendship<UserProfileWithFavorite>>({
        queryKey: profileQueryKey,
        queryFn: () => {
            return profileService.getUserProfile(userId);
        },
    });

    return {
        user,
    };
};