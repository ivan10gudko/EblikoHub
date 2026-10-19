export const friendshipKeys = {
    all: ['friendships'] as const,
    user: (userId: string) => [...friendshipKeys.all, userId] as const,
    pendingRequests: (userId: string) => [...friendshipKeys.user(userId), 'pending-requests'] as const,
};