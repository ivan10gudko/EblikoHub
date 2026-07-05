import { useQuery } from "@tanstack/react-query";
import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import { roomService } from "~/entities/room/api/roomService";
import { Button } from "~/shared/ui/Button";
import { RequestStatus, RequestType } from "~/shared/types";
import { UserAvatar } from "~/entities/user";
import type { RoomRequestShortWithUser } from "~/entities/room/model/room.types";

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

  const requests = data?.requests || [];

  if (isLoading) return <div className="text-sm text-foreground/80 animate-pulse p-4">Loading requests...</div>;
  if (isError) return <div className="text-sm text-danger p-4">Server error. </div>;

  return (
    <div className="flex flex-col gap-4 w-full text-foreground">
      
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold font-industrial text-foreground tracking-wide">
          Pending Join Requests
        </h3>
        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
          {requests.length}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-foreground/80 italic py-4">No pending join requests.</p>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {requests.map((req: RoomRequestShortWithUser) => {
            const senderUser = req.sender;
            const requestId = req.id;

            if (!senderUser) return null;

            return (
              <div
                key={requestId}
                className="relative flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] cursor-pointer transition-all duration-200 group min-h-[96px]"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <UserAvatar name={senderUser.name || "Unknown"} src={senderUser.img} size="md" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-foreground truncate tracking-wide group-hover:text-primary transition-colors">
                      {senderUser.name || "Unknown User"}
                    </span>
                    {senderUser.nameTag && (
                      <span className="text-xs text-muted-foreground/70 truncate mt-0.5 font-medium">
                        @{senderUser.nameTag}
                      </span>
                    )}
                  </div>
                </div>

                
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    disabled={isPendingAction}
                    onClick={() => rejectRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                    className="w-full border border-danger/40 text-foreground/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40 "
                  >
                    Reject
                  </Button>
                  <Button
                    disabled={isPendingAction}
                    onClick={() => acceptRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                    className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-bold border border-primary/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    Accept
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};