import type { Character } from "~/entities/character";

export interface FavoriteCharacterItem {
    id: string;
    position: number;
    character: Character;
}

export const MAX_FAVORITE_CHARACTERS = 3;
