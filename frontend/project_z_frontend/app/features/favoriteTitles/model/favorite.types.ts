import type { TitleShortDto } from "~/entities/titleRecord";
import type { UserProfile } from "~/entities/user";

export interface FavoriteTitleItem {
    id:string;
    position:number;
    title:TitleShortDto;
}
export interface UserProfileDto extends UserProfile{
    favoriteTitles:FavoriteTitleItem[];
}