import { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "~/shared/api";
import { Button } from "~/shared/ui/Button";
import { TitleType, TitleTypeThemes } from "~/entities/titleRecord";
import type { RoomTitleLinkDetailsDto } from "~/features/manageRoomTitles/model/roomTitle.types";
import { formatDate } from "~/shared/helpers";
import { useRoomTitleLinkActions } from "../../hooks/useRoomTitleLinkActions";
import { roomTitleKeys } from "../../model/roomTitle.queryKeys";

interface ViewLinksScreenProps {
  onClose: () => void;
  roomId: number;
  roomTitleId: string;
  canDelete?: boolean;
}

export const ViewAllRoomTitleLinksScreen = ({
  onClose,
  roomId,
  roomTitleId,
  canDelete = false,
}: ViewLinksModalProps) => {
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const queryKey = roomTitleKeys.userLinks(roomId, roomTitleId);

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
    enabled: !!roomId && !!roomTitleId,
  });

  const { deleteLink, isDeleting } = useRoomTitleLinkActions(roomId);

  const handleDeleteLink = (linkId: string) => {
    setDeletingLinkId(linkId);
    deleteLink(
      { roomTitleLinkId: linkId, roomTitleId },
      {
        onSettled: () => setDeletingLinkId(null),
      }
    );
  };

  return (
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-foreground-muted">
              Loading...
            </div>
          ) : isError ? (
            <div className="p-4 text-center text-danger font-medium text-sm">
              Failed to load links.
            </div>
          ) : links.length > 0 ? (
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <LinkItem
                  key={link.id}
                  link={link}
                  canDelete={canDelete}
                  isDeleting={isDeleting && deletingLinkId === link.id}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          ) : (
            <p className="p-4 text-center text-foreground-muted text-sm">
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
  );
};


interface LinkItemProps {
  link: RoomTitleLinkDetailsDto;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: (linkId: string) => void;
}

const LinkItem = ({ link, canDelete, isDeleting, onDelete }: LinkItemProps) => {
  const titleData = link.title;
  const themeClass = titleData?.type
    ? TitleTypeThemes[titleData.type as TitleType]
    : "border-border hover:border-foreground/30";

  return (
    <div className={`flex items-center justify-between p-2 border rounded-xl transition-all ${themeClass}`}>
      <div className="flex items-center gap-3 overflow-hidden">
        <TitleCover imageUrl={titleData?.imageUrl} altName={titleData?.titleName} />

        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate text-foreground">
            {titleData?.titleName || "Untitled Title"}
          </span>
          {link.createdAt && (
            <span className="text-xs text-foreground-muted truncate">
              Linked: {formatDate(link.createdAt)}
            </span>
          )}
        </div>
      </div>

      {canDelete && (
        <Button
          onClick={() => onDelete(link.id)}
          disabled={isDeleting}
          className="p-1.5 w-14 border border-danger/30 bg-danger/40 text-white/70 hover:bg-danger/20 hover:text-danger rounded-xl transition-colors shrink-0 flex items-center justify-center"
        >
          <DeleteOutlineIcon className="text-xl" />
        </Button>
      )}
    </div>
  );
};

interface TitleCoverProps {
  imageUrl?: string | null;
  altName?: string | null;
}

const TitleCover = ({ imageUrl, altName }: TitleCoverProps) => (
  <div className="w-16 h-10 bg-background-muted rounded-lg flex items-center justify-center shrink-0 border border-border overflow-hidden">
    {imageUrl ? (
      <img
        src={imageUrl}
        alt={altName || "Title cover"}
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
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    )}
  </div>
);