import { useEffect, useState } from "react";
import type { TitleRecord } from "~/entities/titleRecord";
import { RatingEditorContent } from "./RatingEditorContent";
import { ReadonlyRatingContent } from "./ReadonlyRatingContent";
import type { Rating } from "~/shared/types";
import { useTitleRatingMutation } from "../hooks/useTitleRatingMutation";

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
  const { rate } = useTitleRatingMutation(title.titleId);

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
      rate(localRatings);
    }
    onClose();
  };

  return isOwn ? (
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
  );
};