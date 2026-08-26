
import type { WithFriendship } from "~/entities/friendship";
import type { UserProfile } from "~/entities/user";
import type { FavoriteTitleItem } from "../../manageFavoriteTitles/model/favorite.types";

export interface UserProfileWithFavorite extends UserProfile {
    favoriteTitles: FavoriteTitleItem[];
}