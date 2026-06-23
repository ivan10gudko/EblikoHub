import type { QueryParams } from "~/shared/types";

export interface UserProfile{
    userId: string;
    name: string;
    nameTag: string;
    description?: string;
    img?: string;
    createdAt?: string;
}

export interface CreateUserProfile{
    userId: string;
    name: string;
    nameTag: string;
}

export interface UpdateUserProfile{
    name: string;
    description?: string;
}
export interface UserParams extends QueryParams{

}
export interface BadgeUser {
    id: string;
    type: "DEVELOPER" | "RESPECTED"  ;
    user: UserProfile; 
}