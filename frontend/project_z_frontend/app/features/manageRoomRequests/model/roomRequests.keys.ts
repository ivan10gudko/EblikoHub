export const roomRequestKeys = {
    all: ['room-requests'] as const,
    room: (roomId: number) => [...roomRequestKeys.all, roomId] as const,
    joinRequestsExists: (roomId: number) => [...roomRequestKeys.room(roomId), 'join-requests-exists'] as const,
    InvitesExists: () => [...roomRequestKeys.all, 'invites-exists'] as const,
};