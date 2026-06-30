import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useEffect, useState } from "react";
import {
  TitleType,
  titleTypeOptions,
  TitleTypeOptionsColors,
} from "~/entities/titleRecord";
import type { TitleRecord } from "~/entities/titleRecord";
import { StatusSelect } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { Status, statusColorConfig } from "~/shared/types/Status";
import { CompactRate } from "~/shared/ui/CompactRate";
import { Select } from "~/shared/ui/Select/Select";
import { notify } from "~/shared/lib/notify";
import type { Rating } from "~/shared/types";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { getStatusColor } from "~/shared/utils";
import TitleTypeSelect from "~/entities/titleRecord/ui/TitleTypeSelect";

interface EditTitleModalProps {
  title: TitleRecord;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTitleModal = ({
  title,
  isOpen,
  onClose,
}: EditTitleModalProps) => {
  const [titleName, setTitleName] = useState(title.titleName);
  const [imageUrl, setImageUrl] = useState<string | null>(
    title.imageUrl ?? null,
  );
  const [status, setStatus] = useState<Status>(title.status);
  const [rating, setRating] = useState<number | undefined>(
    title.rating?.overall,
  );
  const [titleType, setTitleType] = useState<TitleType>(
    title.titleType ?? TitleType.ANIME,
  );

  const { updateTitle, isUpdating } = useUpdateTitleRecord(title.titleId);

  useEffect(() => {
    if (isOpen) {
      setTitleName(title.titleName);
      setImageUrl(title.imageUrl ?? null);
      setStatus(title.status);
      setRating(title.rating?.overall);
      setTitleType(title.titleType ?? TitleType.ANIME);
    }
  }, [isOpen, title]);

  const handleSave = (shouldCloseAfter = true) => {
    if (!titleName.trim()) {
      notify.error("Title name cannot be empty");
      return;
    }

    const hasChanges =
      titleName !== title.titleName ||
      imageUrl !== title.imageUrl ||
      status !== title.status ||
      rating !== title.rating?.overall ||
      titleType !== title.titleType;

    if (!hasChanges) {
      if (shouldCloseAfter) onClose();
      return;
    }

    let finalRating: Partial<Rating> | undefined = undefined;

    if (rating !== undefined) {
      finalRating = {
        ...title.rating,
        overall: rating,
      };
    } else if (title.rating) {
      finalRating = { ...title.rating };
      delete finalRating.overall;
    }

    updateTitle(
      {
        titleName,
        imageUrl,
        status,
        rating: finalRating as Rating,
        titleType,
      },
      {
        onSuccess: () => {
          notify.success("Changes saved automatically");
          if (shouldCloseAfter) onClose();
        },
        onError: () => {
          notify.error("Failed to save changes");
        },
      },
    );
  };

  const handleBackdropClick = () => {
    handleSave(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleBackdropClick}
      title={`Edit "${title.titleName}"`}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col max-h-[70vh] h-full justify-between p-2 custom-scrollbar">
        <div className="overflow-y-auto flex-1 pr-1 pb-6 space-y-8">
          <ImageUrlEditor imageUrl={imageUrl} onImageChange={setImageUrl} />

          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                name="Title name"
                value={titleName}
                onChange={(val) => setTitleName(val)}
                placeholder="Enter custom name..."
                className="h-12 border-2 p-3 border-border focus:border-primary rounded-xl font-bold"
              />
            </div>

            <div className="w-full space-y-2">
              <label className="text-xs font-bold tracking-widest text-muted-foreground ml-1 uppercase opacity-70 block">
                Title Type
              </label>
              <div className="w-full sm:max-w-xs">
                <TitleTypeSelect
                  value={titleType}
                  onChange={(val: string) => setTitleType(val as TitleType)}
                  className="h-12 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-2">
                <StatusSelect
                  variant="page"
                  initialData={title}
                  titleRecord={{ ...title, status }}
                  onStatusChange={(newStatus) => setStatus(newStatus)}
                  className="h-12 w-full border-2 border-border rounded-xl bg-background font-bold text-sm"
                />
              </div>

              <div className="space-y-2">
                <div className="h-12 px-4 flex items-center justify-center">
                  <CompactRate
                    currentRating={rating}
                    onRate={(val) => setRating(val)}
                    onClear={() => setRating(undefined)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-foreground bg-card border-none flex-1 h-14 rounded-xl font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isUpdating}
            className="flex-[2] h-14 rounded-xl bg-primary text-foreground font-black tracking-wide shadow-[0_4px_0_0_#d97706] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
