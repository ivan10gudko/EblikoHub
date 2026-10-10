export const roomBanKeys = {
    bans: (roomId: number) => ['rooms', roomId, 'bans'] as const,
};