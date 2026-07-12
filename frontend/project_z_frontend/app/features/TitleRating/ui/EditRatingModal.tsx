import { useEffect, useState } from "react";
import Modal from "~/shared/ui/Modal/Modal";
import {
  type TitleRecord,
  useTitleRecordMutation,
} from "~/entities/titleRecord";
import { RatingEditorContent } from "./RatingEditorContent";
import { ReadonlyRatingContent } from "./ReadonlyRatingContent";
import type { Rating } from "~/shared/types";

interface EditRatingModalProps {
  title: TitleRecord;
  isOpen: boolean;
  onClose: () => void;
  isOwn: boolean;
  onTitleChange?: (newTitleId: number) => void;
}

export const EditRatingModal = ({
  title,
  isOpen,
  onClose,
  isOwn,
  onTitleChange,
}: EditRatingModalProps) => {
  const { rate } = useTitleRecordMutation(
    title.apiTitleId,
    {
      apiTitleId: title.apiTitleId,
      titleName: title.titleName,
      status: title.status,
      rating: title.rating,
      imageUrl: title.imageUrl,
      titleType: title.titleType,
      pinned: title.pinned,
      description: title.description || "",
    },
    title,
  );

  const [localRatings, setLocalRatings] = useState<Rating>(
    title.rating && "overall" in title.rating
      ? (title.rating as Rating)
      : { overall: 0 },
  );

  useEffect(() => {
    if (isOpen && title.rating) {
      setLocalRatings(title.rating as Rating);
    }
  }, [isOpen, title.rating]);

  const handleSave = () => {
    if (!isOwn) {
      onClose();
      return;
    }

    const hasChanges =
      JSON.stringify(localRatings) !== JSON.stringify(title.rating);

    if (hasChanges) {
      rate(localRatings);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isOwn ? handleSave : onClose}
      title={
        isOwn
          ? `Edit Rating "${title.titleName}"`
          : `Rating Overview "${title.titleName}"`
      }
      maxWidth="max-w-2xl"
    >
      {isOwn ? (
        <RatingEditorContent
          titleId={title.titleId}
          ratings={localRatings}
          avgRating={title.avgRating || 0}
          onChange={setLocalRatings}
          isSaving={false}
          onSave={handleSave}
          onCancel={onClose}
          onTitleChange={onTitleChange}
        />
      ) : (
        <ReadonlyRatingContent
          ratings={(title.rating as Rating) || { overall: 0 }}
          onCancel={onClose}
          onTitleChange={onTitleChange}
          titleId={title.titleId}
        />
      )}
    </Modal>
  );
};
