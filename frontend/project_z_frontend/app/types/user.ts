export interface BackendUserDto {
    userId: string;
    name: string;
    nameTag: string;
    description?: string;
    img?: string;
    createdAt?: string;
    watchList?: string[];
}