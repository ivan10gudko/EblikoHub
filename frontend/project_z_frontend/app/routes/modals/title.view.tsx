import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { ViewTitleScreen } from "~/entities/titleRecord/ui/ViewTitleScreen";
import { useTitleById } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";

export default function WatchlistViewRoute() {
  const navigate = useNavigate();
  const { titleId, userId } = useParams();
  const { data: title } = useTitleById(Number(titleId));
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  const handleClose = () => {
    navigate(-1);
  };

  const handleEditClick = () => {
    navigate(`../../edit/${titleId}`, { relative: "path"});
  };

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={title ? `"${title.titleName}"` : "Title Details"}
      maxWidth="max-w-2xl"
    >
      <ViewTitleScreen
        titleId={Number(titleId)}
        onClose={handleClose}
        onEditClick={isOwn ? handleEditClick : undefined}
        isOwn={isOwn}
      />
    </Modal>
  );
}
