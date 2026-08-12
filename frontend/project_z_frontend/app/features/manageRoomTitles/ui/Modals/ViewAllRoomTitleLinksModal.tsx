import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/shared/api";
import { Button } from "~/shared/ui/Button";
import { Modal } from "~/shared/ui/Modal";
import { TitleType, TitleTypeThemes } from "~/entities/titleRecord";
import type { RoomTitleLinkDetailsDto } from "~/features/manageRoomTitles/model/roomTitle.types";

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
      const response = await apiClient.get(
        `/rooms/${roomId}/links/roomTitle/${roomTitleId}`
      );
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Title Links"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : isError ? (
            <div className="p-4 text-center text-danger font-medium text-sm">
              Failed to load links.
            </div>
          ) : links.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.map((link: RoomTitleLinkDetailsDto) => {
                const titleData = link.title;
                
                const themeClass = titleData?.type 
            
                  ? TitleTypeThemes[titleData.type as TitleType] 
                  : "border-border hover:border-foreground/30";

                return (
                  <div
                    key={link.id}
                    className={`flex items-center justify-between p-2 border rounded-xl transition-all ${themeClass}`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-16 h-10 bg-background-muted rounded-lg flex items-center justify-center shrink-0 border border-border overflow-hidden">
                        {titleData?.imageUrl ? (
                          <img
                            src={titleData.imageUrl}
                            alt={titleData?.titleName || "Title cover"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-5 h-5 text-foreground-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-sm truncate text-foreground">
                          {titleData?.titleName || "Untitled Title"}
                        </span>
                        {link.createdAt && (
                          <span className="text-xs text-foreground-muted truncate">
                            Linked: {new Date(link.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {canDelete && (
                      <Button
                        onClick={() => handleDeleteLink(link.id)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 w-14 border border-danger/30 bg-danger/40 text-white/70 hover:bg-danger/20 hover:text-danger rounded-xl transition-colors shrink-0"
                      >
                        <DeleteOutlineIcon className="text-xl" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-4 text-foreground-muted text-sm">
              No links attached yet.
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-border mt-2 shrink-0">
          <Button onClick={onClose} className="w-full" variant="cancel">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};