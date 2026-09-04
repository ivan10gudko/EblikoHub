import { useEffect, useState } from "react";
import { useTitleRecordMutation, type TitleRecord } from "~/entities/titleRecord";
import { RatingEditorContent } from "./RatingEditorContent";
import { ReadonlyRatingContent } from "./ReadonlyRatingContent";
import type { Rating } from "~/shared/types";

interface EditRatingScreenProps {
  title: TitleRecord;
  onClose: () => void;
  isOwn: boolean;
  onTitleChange?: (newTitleId: number) => void;
}

export const EditRatingScreen = ({
  title,
  onClose,
  isOwn,
  onTitleChange,
}: EditRatingScreenProps) => {
  const { rate, rateLoading } = useTitleRecordMutation(
    title.apiTitleId,
    { ...title, description: title.description ?? "" },
    title,
  );

  const [localRatings, setLocalRatings] = useState<Rating>(
    title.rating && "overall" in title.rating
      ? (title.rating as Rating)
      : { overall: 0 },
  );

  useEffect(() => {
    if (title.rating) {
      setLocalRatings(title.rating as Rating);
    }
  }, [title.titleId, title.rating]);

  const handleSave = () => {
    if (!isOwn) {
      onClose();
      return;
    }

    const hasChanges =
      JSON.stringify(localRatings) !== JSON.stringify(title.rating);

    if (hasChanges) {
      rate(localRatings, {
        onSuccess: onClose,
      });
    } else {
      onClose();
    }
  };

  return isOwn ? (
    <RatingEditorContent
      titleId={title.titleId}
      ratings={localRatings}
      avgRating={title.avgRating || 0}
      onChange={setLocalRatings}
      isSaving={rateLoading}
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
  );
};