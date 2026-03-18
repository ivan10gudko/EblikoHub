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