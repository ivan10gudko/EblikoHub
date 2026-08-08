import type { TitleShortDto } from "~/entities/titleRecord";

export interface FavoriteTitleItem {
    id:string;
    position:number;
    title:TitleShortDto;
}