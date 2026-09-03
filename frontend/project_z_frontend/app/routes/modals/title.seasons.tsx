import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { useTitleById } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { EditSeasonsScreen } from "~/features/manageSeason";

export default function SeasonsRoute() {
  const navigate = useNavigate();
  const { titleId, userId } = useParams();
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  const { data: title } = useTitleById(Number(titleId));
  const handleClose = () => {
    navigate(-1);
  };

  if (!title) {
    return (
      <ErrorAnimePage></ErrorAnimePage>
    )
  }
  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={`edit seasons of ${title?.titleName}`}
      maxWidth="max-w-2xl"
    >
      <EditSeasonsScreen
        titleId={title.titleId}
        isOwn={isOwn}
      />
    </Modal>
  );
}
