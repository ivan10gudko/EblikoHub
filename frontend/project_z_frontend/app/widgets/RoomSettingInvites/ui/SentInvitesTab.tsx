import { useQuery } from "@tanstack/react-query";
import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import { roomService } from "~/entities/room/api/roomService";
import { UserShortRow } from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import { RequestStatus, RequestType } from "~/shared/types";

interface SentInvitesTabProps {
  roomId: number;
}

export const SentInvitesTab = ({ roomId }: SentInvitesTabProps) => {
  const { cancelRequest, isPendingAction } = useRoomRequests(roomId);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["room_requests", roomId, RequestStatus.PENDING, RequestType.INVITE],
    queryFn: () => roomService.getRoomRequests(roomId, RequestStatus.PENDING, RequestType.INVITE),
    enabled: !!roomId,
  });

  // Мапимося з поля .requests, яке прийшло з бекенду
  const sentInvites = (data as any)?.requests || [];

  if (isLoading) return <div className="text-sm text-neutral-400 animate-pulse p-4">Loading sent invites...</div>;
  if (isError) return <div className="text-sm text-red-500 p-4">Server error (500). Wait for backend fix.</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-white">
      <div className="border-b border-neutral-800 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Sent Room Invites ({sentInvites.length})
        </h3>
      </div>

      {sentInvites.length === 0 ? (
        <p className="text-sm text-neutral-600 italic py-4">No pending sent invites.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {sentInvites.map((invite: any) => {
            // Для інвайтів отримувач лежить у полі `user`
            const targetUser = invite.user;
            const requestId = invite.id;

            if (!targetUser) return null;

            return (
              <UserShortRow key={requestId} user={targetUser}>
                <Button
                  disabled={isPendingAction}
                  onClick={() => cancelRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                  className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-xs font-semibold border border-red-500/20 transition-all disabled:opacity-50 shrink-0"
                >
                  Cancel Invite
                </Button>
              </UserShortRow>
            );
          })}
        </div>
      )}
    </div>
  );
};