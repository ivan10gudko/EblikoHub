import type { TitleShort } from "~/entities/titleRecord";


export interface FavoriteTitleItem {
    id:string;
    position:number;
    title:TitleShort;
}