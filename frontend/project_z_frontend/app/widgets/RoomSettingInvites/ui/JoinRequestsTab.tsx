import { useQuery } from "@tanstack/react-query";
import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import { roomService } from "~/entities/room/api/roomService";
import { UserShortRow } from "~/entities/user";
import { Button } from "~/shared/ui/Button";
import { RequestStatus, RequestType } from "~/shared/types";

interface JoinRequestsTabProps {
  roomId: number;
}

export const JoinRequestsTab = ({ roomId }: JoinRequestsTabProps) => {
  const { acceptRequest, rejectRequest, isPendingAction } = useRoomRequests(roomId);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["room_requests", roomId, RequestStatus.PENDING, RequestType.JOIN_REQUEST],
    queryFn: () => roomService.getRoomRequests(roomId, RequestStatus.PENDING, RequestType.JOIN_REQUEST),
    enabled: !!roomId,
  });

  
  const requests = (data as any)?.requests || [];

  if (isLoading) return <div className="text-sm text-neutral-400 animate-pulse p-4">Loading requests...</div>;
  if (isError) return <div className="text-sm text-red-500 p-4">Server error (500). Wait for backend fix.</div>;

  return (
    <div className="flex flex-col gap-4 w-full max-w-md text-white">
      <div className="border-b border-neutral-800 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          Pending Join Requests ({requests.length})
        </h3>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-neutral-600 italic py-4">No pending join requests.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {requests.map((req: any) => {
            // Для запитів на вступ (JOIN) ініціатором і відправником є той самий юзер, тому беремо `sender`
            const senderUser = req.sender;
            const requestId = req.id;

            if (!senderUser) return null;

            return (
              <UserShortRow key={requestId} user={senderUser}>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    disabled={isPendingAction}
                    onClick={() => rejectRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold border border-neutral-700 transition-all disabled:opacity-50"
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={isPendingAction}
                    onClick={() => acceptRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                    className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-bold border border-primary/30 transition-all disabled:opacity-50"
                  >
                    Accept
                  </Button>
                </div>
              </UserShortRow>
            );
          })}
        </div>
      )}
    </div>
  );
};