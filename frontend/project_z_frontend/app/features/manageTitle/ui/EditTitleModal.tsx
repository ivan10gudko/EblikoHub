import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useEffect, useState } from "react";
import { TitleType } from "~/entities/titleRecord";
import type { TitleRecord } from "~/entities/titleRecord";
import { StatusSelect } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { Status } from "~/shared/types/Status";
import { CompactRate } from "~/shared/ui/CompactRate";
import { notify } from "~/shared/lib/notify";
import type { Rating } from "~/shared/types";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
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
  const [imageUrl, setImageUrl] = useState<string | null>(title.imageUrl ?? null);
  const [status, setStatus] = useState<Status>(title.status);
  const [rating, setRating] = useState<number | undefined>(title.rating?.overall);
  const [titleType, setTitleType] = useState<TitleType>(title.titleType ?? TitleType.ANIME);
  const [description, setDescription] = useState(title.description ?? "");

  const { updateTitle, isUpdating } = useUpdateTitleRecord(title.titleId);

  useEffect(() => {
    if (isOpen) {
      setTitleName(title.titleName);
      setImageUrl(title.imageUrl ?? null);
      setStatus(title.status);
      setRating(title.rating?.overall);
      setTitleType(title.titleType ?? TitleType.ANIME);
      setDescription(title.description ?? "");
    }
  }, [isOpen]);

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
      titleType !== title.titleType ||
      description !== (title.description ?? "");

    if (!hasChanges) {
      if (shouldCloseAfter) onClose();
      return;
    }

    let finalRating: Partial<Rating> | undefined = undefined;

    if (rating !== undefined) {
      finalRating = { ...title.rating, overall: rating };
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
        description,
      },
      {
        onSuccess: () => {
          notify.success("Changes saved successfully");
          if (shouldCloseAfter) onClose();
        },
        onError: () => {
          notify.error("Failed to save changes");
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleSave(true)}
      title={`Edit "${title.titleName}"`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col max-h-[70vh] h-full justify-between p-2">
        <div className="overflow-y-auto flex-1 pr-2 pb-6 space-y-6 custom-scrollbar min-h-0">
          
          
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
            <div className="w-40 h-56 shrink-0 rounded-xl overflow-hidden shadow-md border border-border/40">
              <ImageUrlEditor imageUrl={imageUrl} onImageChange={setImageUrl} />
            </div>

            <div className="flex-1 space-y-4 w-full text-left">
           
              <div>
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                  Title Name
                </label>
                <Input
                  name="Title name"
                  value={titleName}
                  onChange={(val) => setTitleName(val)}
                  placeholder="Enter custom name..."
                  className="h-12 border-2 p-3 border-border focus:border-primary rounded-xl font-bold w-full"
                />
              </div>

              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Type
                  </label>
                  <TitleTypeSelect
                    value={titleType}
                    onChange={(val: string) => setTitleType(val as TitleType)}
                    className="h-12 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                    Status
                  </label>
                  <StatusSelect
                    variant="page"
                    initialData={title}
                    titleRecord={{ ...title, status }}
                    onStatusChange={(newStatus) => setStatus(newStatus)}
                    className="h-12 w-full border-2 border-border rounded-xl bg-background font-bold text-sm"
                  />
                </div>
              </div>

         
              <div className="pt-2">
                <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1">
                  Rating
                </label>
                <div className="h-12 flex items-center justify-start bg-card/40 border border-border/40 rounded-xl px-2 w-fit">
                  <CompactRate
                    currentRating={rating}
                    onRate={(val) => setRating(val)}
                    onClear={() => setRating(undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

         
          <div className="space-y-2 border-t border-border/40 pt-4">
            <label className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 block mb-1 ml-1">
              Description & Notes
            </label>
            <textarea
              name="Description"
              placeholder="Enter title description, plot summary or your notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full p-4 border-2 border-border focus:border-primary rounded-xl font-medium text-foreground text-sm bg-background/50 hover:border-border/80 focus:bg-background transition-all shadow-sm resize-none custom-scrollbar outline-none focus:ring-2 focus:ring-primary/10"
            />
          </div>

        </div>

   
        <div className="flex gap-3 pt-4 border-t border-border bg-background mt-auto shrink-0">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:flex-1 h-12 sm:h-14 rounded-xl border-2 border-border bg-background text-foreground/80 font-bold tracking-wide hover:-translate-y-[2px] hover:bg-background-muted hover:text-foreground hover:shadow-[0_4px_0_0_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_0_0_var(--color-border)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isUpdating}
            className="w-full sm:flex-[2] h-12 sm:h-14 rounded-xl bg-primary text-background font-black tracking-wide shadow-[0_4px_0_0_#d97706] hover:bg-primary/90 hover:shadow-[0_4px_0_0_#b45309] active:translate-y-[2px] active:shadow-[0_2px_0_0_#b45309] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
          >
            {isUpdating ? "Saving Changes..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};