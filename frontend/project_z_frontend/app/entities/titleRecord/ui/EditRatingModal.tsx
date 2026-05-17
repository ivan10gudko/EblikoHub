import { useEffect, useState } from "react";
import Modal from "~/shared/ui/Modal/Modal";
import { type TitleRecord, useTitleRecordMutation } from "~/entities/titleRecord";
import type { Rating } from "~/shared/types";
import { RatingEditorContent } from "~/shared/ui/RatingEditorContent";

interface EditRatingModalProps {
  title: TitleRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const EditRatingModal = ({ title, isOpen, onClose }: EditRatingModalProps) => {
  const { rate, rateLoading } = useTitleRecordMutation(
    title.apiTitleId,
    {
      apiTitleId: title.apiTitleId,
      titleName: title.titleName,
      status: title.status,
      rating: title.rating,
      imageUrl: title.imageUrl,
    },
    title
  );
  const [localRatings, setLocalRatings] = useState<Rating>(
    title.rating && "overall" in title.rating ? title.rating : { overall: 0 }
  );

  useEffect(() => {
    if (title.rating) {
      setLocalRatings(title.rating);
    }
  }, [title.rating]);

  const handleSave = () => {
    rate(localRatings);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Custom Rating System"
      maxWidth="max-w-xl"
    >
      <RatingEditorContent
        ratings={localRatings}
        onChange={setLocalRatings}
        isSaving={rateLoading}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  );
};