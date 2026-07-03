import type { UserShort } from "~/entities/room";
import type { Title } from "~/entities/title/model/animeTitle.types";
import type { TitleShortDto, TitleType, TitleVisual } from "~/entities/titleRecord";
import type { PageResponse, QueryParams, Status } from "~/shared/types";

export interface RoomTitleQueryParameters extends QueryParams {
    types: TitleType[];
    status?: Status;
    memberIds: string[];
}
export interface RoomTitleShort {
    id: string;
    titleName: string;
    imageUrl: string;
    type: TitleType;
    apiTitleId: number;
}
export interface RoomTitleDetails {
  id: string; 
  titleName: string;
  imageUrl?: string | null;
  titleType: TitleType;
  apiTitleId?: number | null;
  addedByUserId: string;
  createdAt: string; 
}
export interface RoomTitleLinkShort {
    id: string;
    title: TitleVisual;
    roomTitleId: string;
    createdAt: string;
}

export interface RoomTitleWithSearchQueryParams extends QueryParams{
    search?:string;
}
export interface RoomTitleWithUserLinks {
    id: string;
    titleName: string;
    imageUrl: string;
    titleType: TitleType;
    apiTitleId: number;
    addedByUserId: string;
    links: RoomTitleLinkShort[];
    createdAt: string;
}
export interface RoomTitleSummary {
    roomTitleId: string;
    titleInfo: RoomTitleShort
    computedAvgRating: number;
    myStatus: Status;
    myTitleInfo: TitleShortDto
    userParticipation: RoomTitleUserIdAndTitleStatus[]
}
export interface RoomTitleShort {
    id: string;

    titleName: string;

    imageUrl: string;

    titleType: TitleType;

    apiTitleId: number;
}
export interface RoomTitleUserIdAndTitleStatus {
    userId: string;
    status: Status
}
export interface RoomTitlesResponse {
    content: PageResponse<RoomTitleSummary>;
    usersCache: Record<string, UserShort>;
}
export interface RoomTitleCreateRequest {
    titleName: string;
    imageUrl?: string | null;
    titleType: TitleType;
    apiTitleId: number;
}