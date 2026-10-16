import { useEffect, useState } from "react";
import { useTitleRecordMutation, type TitleRecord } from "~/entities/titleRecord";
import { RatingEditorContent } from "./RatingEditorContent";
import { ReadonlyRatingContent } from "./ReadonlyRatingContent";
import type { Rating } from "~/shared/types";
import { useNavigate } from "react-router";

interface EditRatingScreenProps {
  title: TitleRecord;
  onClose: () => void;
  isOwn: boolean;
}

const getInitialRating = (rating: TitleRecord["rating"]): Rating => {
  return rating && "overall" in rating ? (rating as Rating) : { overall: 0 };
};

export const EditRatingScreen = ({
  title,
  onClose,
  isOwn,
}: EditRatingScreenProps) => {
  const navigate = useNavigate();
  const { rate, rateLoading } = useTitleRecordMutation(
    title.apiTitleId,
    title,
    title
  );
  const [localRatings, setLocalRatings] = useState<Rating>(() =>
    getInitialRating(title.rating)
  );
  
  useEffect(() => {
    if (title.rating) {
      setLocalRatings(getInitialRating(title.rating));
    }
  }, [title.titleId, title.rating]);

  const handleTitleChange = (newTitleId: number) => {
    const hasChanges =
      JSON.stringify(localRatings) !== JSON.stringify(title.rating);

    if (hasChanges) {
      rate(localRatings, {
        onSuccess: () => {
          navigate(`../${newTitleId}`, { relative: "path" });
        },
      });
    } else {
      navigate(`../${newTitleId}`, { relative: "path" });
    }
  };

  const handleSave = () => {
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

  if (!isOwn) {
    return (
      <ReadonlyRatingContent
        ratings={getInitialRating(title.rating)}
        onCancel={onClose}
        onTitleChange={handleTitleChange}
        titleId={title.titleId}
      />
    );
  }

  return (
    <RatingEditorContent
      titleId={title.titleId}
      ratings={localRatings}
      avgRating={title.avgRating || 0}
      onChange={setLocalRatings}
      isSaving={rateLoading}
      onSave={handleSave}
      onCancel={onClose}
      onTitleChange={handleTitleChange}
    />
  );
};