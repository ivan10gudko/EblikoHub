export const roomMembersKeys = {
    members: (roomId: number) => ['rooms', roomId, 'members'] as const,
};