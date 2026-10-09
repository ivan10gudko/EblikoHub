import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { ViewTitleScreen } from "~/entities/titleRecord/ui/ViewTitleScreen";
import { useTitleById } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";
import { useSeasonById } from "~/entities/season/hooks/useSeasonById";
import ViewSeasonScreen from "~/entities/season/ui/ViewSeasonScreen";

export default function WatchlistViewRoute() {
  const navigate = useNavigate();
  const { seasonId, userId } = useParams();
  const { season } = useSeasonById(Number(seasonId));
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    navigate(`../../edit/${seasonId}`, { relative: "path"});
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={season ? `"${season.name}"` : "Title Details"}
      maxWidth="max-w-2xl"
    >
      <ViewSeasonScreen
        season={season}
        onClose={handleClose}
        onEditClick={isOwn ? handleEditClick : undefined}
        isOwn={isOwn}
      />
    </Modal>
  );
}
