import { useQuery } from "@tanstack/react-query";
import { useRoomRequests } from "~/entities/room/hooks/useRoomRequests";
import { roomService } from "~/entities/room/api/roomService";
import { Button } from "~/shared/ui/Button";
import { RequestStatus, RequestType } from "~/shared/types";
import { UserAvatar } from "~/entities/user";
import type { RoomRequestShort, RoomRequestShortWithUser } from "~/entities/room";

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

  const sentInvites = data?.requests || [];

  if (isLoading) return <div className="text-sm text-foreground/80 animate-pulse p-4">Loading sent invites...</div>;
  if (isError) return <div className="text-sm text-danger p-4">Server error.</div>;

  return (
    <div className="flex flex-col gap-4 w-full text-foreground">
      
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xl font-bold font-industrial text-foreground tracking-wide">
          Sent Room Invites
        </h3>
        <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
          {sentInvites.length}
        </span>
      </div>

      {sentInvites.length === 0 ? (
        <p className="text-sm text-neutral-600 italic py-4">No pending sent invites.</p>
      ) : (
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
          {sentInvites.map((invite: RoomRequestShortWithUser) => {
            const targetUser = invite.user;
            const requestId = invite.id;

            if (!targetUser) return null;

            return (
              <div
                key={requestId}
                className="relative flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md border border-border rounded-xl hover:border-primary/40 hover:bg-primary/[0.02] hover:scale-[1.01] hover:shadow-lg hover:shadow-primary/[0.02] cursor-pointer transition-all duration-200 group min-h-[96px]"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
                    <UserAvatar name={targetUser.name || "Unknown"} src={targetUser.img} size="md" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-foreground truncate tracking-wide group-hover:text-primary transition-colors">
                      {targetUser.name || "Unknown User"}
                    </span>
                    {targetUser.nameTag && (
                      <span className="text-xs text-muted-foreground/70 truncate mt-0.5 font-medium">
                        @{targetUser.nameTag}
                      </span>
                    )}
                  </div>
                </div>

                
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Button
                    disabled={isPendingAction}
                    onClick={() => cancelRequest({ roomRequestId: requestId }, { onSuccess: () => refetch() })}
                    className="px-3 py-1.5 bg-danger/10 hover:bg-red-500/10 text-red-500 rounded-lg text-xs font-semibold border border-danger/20 transition-all disabled:opacity-50 shrink-0 cursor-pointer whitespace-nowrap"
                  >
                    Cancel Invite
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