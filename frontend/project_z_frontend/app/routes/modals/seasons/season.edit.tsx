import { useNavigate, useParams } from "react-router";
import { Modal } from "~/shared/ui/Modal";
import { useAuthStore } from "~/features/auth";
import ErrorAnimePage from "~/pages/animePage/ui/ErrorAnimePage";
import { notify } from "~/shared/lib";
import { useEffect } from "react";
import { useSeasonById } from "~/entities/season/hooks/useSeasonById";
import { EditSeasonScreen } from "~/features/manageSeason";

export default function EditSeasonRoute() {
  const navigate = useNavigate();
  const { seasonId, userId, titleId } = useParams();
  const { season, isLoading } = useSeasonById(Number(seasonId));
  const currentUserId = useAuthStore((state) => state.userId);
  const isOwn = Boolean(currentUserId && currentUserId === userId);

  useEffect(() => {
    if (!isLoading && season && !isOwn) {
      notify.error("You are not an owner!");
      navigate(`../view/${seasonId}`);
    }
  }, [isLoading, season, isOwn, seasonId, navigate]);

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

  if (!season) {
    return <ErrorAnimePage />;
  }

  if (!isOwn) {
    return null;
  }

  return (
    <Modal
      isOpen={true}
      onClose={handleClose}
      title={`Edit "${season.name}"`}
      maxWidth="max-w-2xl"
    >
      <EditSeasonScreen titleId={Number(titleId)} season={season}></EditSeasonScreen>
    </Modal>
  );
}