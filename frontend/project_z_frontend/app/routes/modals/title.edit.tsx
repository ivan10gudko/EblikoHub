import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { useTitleById } from "~/entities/titleRecord";
import { useAuthStore } from "~/features/auth";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { EditTitleScreen } from "~/features/manageTitle";
import { notify } from "~/shared/lib";
import { useEffect } from "react";

export default function EditTitleRoute() {
  const navigate = useNavigate();
  const { titleId, userId } = useParams();
  const { data: title, isLoading } = useTitleById(Number(titleId));
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  useEffect(() => {
    if (!isLoading && title && !isOwn) {
      notify.error("You are not an owner!");
      navigate(`../view/${titleId}`, { replace: true });
    }
  }, [isLoading, title, isOwn, titleId, navigate]);

  const handleClose = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Loading..."
        maxWidth="max-w-2xl"
      >
        <div className="py-16 text-center text-muted-foreground animate-pulse text-sm">
          Loading title...
        </div>
      </Modal>
    );
  }

  if (!title) {
    return <ErrorAnimePage />;
  }

  if (!isOwn) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={`Edit "${title.titleName}"`}
      maxWidth="max-w-2xl"
    >
      <EditTitleScreen title={title} />
    </Modal>
  );
}