import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Modal from "~/shared/ui/Modal/Modal";
import { apiClient } from "~/shared/api";
import type { RoomTitleLinkDetailsDto } from "~/features/manageRooms/model/roomTitle.types";

interface ViewLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  roomTitleId: string;
  canDelete?: boolean;
}

export const ViewAllRoomTitleLinksModal = ({
  isOpen,
  onClose,
  roomId,
  roomTitleId,
  canDelete = false,
}: ViewLinksModalProps) => {
  const queryClient = useQueryClient();
  const queryKey = ["roomTitleLinks", roomId, roomTitleId];

  const {
    data: links = [],
    isLoading,
    isError,
  } = useQuery<RoomTitleLinkDetailsDto[]>({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get(`/rooms/${roomId}/links/roomTitle/${roomTitleId}`);
      return response.data;
    },
    enabled: isOpen && !!roomId && !!roomTitleId,
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkId: string) => {
      await apiClient.delete(`/rooms/${roomId}/links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      console.error("Failed to delete link:", error);
    },
  });

  const handleDeleteLink = (linkId: string) => {
    deleteMutation.mutate(linkId);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Title Links" maxWidth="max-w-md">
      <div className="flex flex-col justify-between h-full space-y-4 pt-2">
        
        <div className="custom-scrollbar max-h-[50vh] min-h-[120px] overflow-y-auto space-y-3 pr-1">
          {isLoading ? (
            <div className="flex justify-center items-center h-28 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : isError ? (
            <div className="flex justify-center items-center h-28 text-destructive text-sm font-medium">
              Failed to load links.
            </div>
          ) : links.length > 0 ? (
            links.map((link: RoomTitleLinkDetailsDto) => {
              const titleData = link.title;

              return (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center shrink-0 border border-border overflow-hidden">
                      {titleData?.imageUrl ? (
                        <img
                          src={titleData.imageUrl}
                          alt={titleData?.titleName || "Title cover"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="font-medium text-sm truncate text-foreground">
                        {titleData?.titleName || "Untitled Title"}
                      </span>
                      {link.createdAt && (
                        <span className="text-xs text-muted-foreground truncate">
                          Linked: {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {canDelete && (
                    <IconButton
                      onClick={() => handleDeleteLink(link.id)}
                      disabled={deleteMutation.isPending}
                      aria-label="delete link"
                      size="small"
                      className=" border  border-danger/40 text-white/70 hover:bg-danger/15 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/30 "
                    >
                      <DeleteIcon className="text-lg" />
                    </IconButton>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-28 text-muted-foreground text-sm">
              No links attached yet.
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-transparent hover:bg-muted border border-border text-foreground rounded-xl font-medium transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};