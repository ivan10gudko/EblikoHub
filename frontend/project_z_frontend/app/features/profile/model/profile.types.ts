
import type { WithFriendship } from "~/entities/friendship";
import type { UserProfile } from "~/entities/user";
import type { FavoriteTitleItem } from "../../manageFavoriteTitles/model/favorite.types";
import type { FavoriteCharacterItem } from "../../manageFavoriteCharacters/model/favoriteCharacter.types";

export interface UserProfileWithFavorite extends UserProfile {
    favoriteTitles: FavoriteTitleItem[];
    favoriteCharacters?: FavoriteCharacterItem[];
}