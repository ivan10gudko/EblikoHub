
import type { WithFriendship } from "~/entities/friendship";
import type { UserProfile } from "~/entities/user";
import type { FavoriteTitleItem } from "./favorite.types";

export interface UserProfileWithFavorite extends UserProfile {
    favoriteTitles: FavoriteTitleItem[];
}