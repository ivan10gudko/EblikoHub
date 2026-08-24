import { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "~/shared/ui/Button";
import { ImageUrlField } from "~/shared/ui/imageUrlField";
import { notify } from "~/shared/lib";
import { TitleType } from "~/entities/titleRecord";
import TitleTypeSelect from "~/entities/titleRecord/ui/TitleTypeSelect";

export interface RoomTitleFormData {
  titleName: string;
  apiTitleId?: string | number | null;
  imageUrl: string | null;
  titleType: TitleType;
}

interface RoomTitleFormProps {
  initialValues?: Partial<RoomTitleFormData>;
  onSubmit: (data: RoomTitleFormData) => void;
  onCancel: () => void;
  isPending?: boolean;
  submitText?: string;
  searchSlot?: React.ReactNode;
}

const DEFAULT_FORM_VALUES: RoomTitleFormData = {
  titleName: "",
  apiTitleId: "",
  imageUrl: null,
  titleType: TitleType.ANIME,
};

export const RoomTitleForm = ({
  initialValues,
  onSubmit,
  onCancel,
  isPending = false,
  submitText = "Save",
  searchSlot,
}: RoomTitleFormProps) => {
  const [formData, setFormData] = useState<RoomTitleFormData>(() => ({
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
  }));

  useEffect(() => {
    if (initialValues) {
      setFormData((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleSave = () => {
    if (!formData.titleName.trim()) {
      notify.error("Title name is required!");
      return;
    }
    onSubmit(formData);
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, imageUrl: null }));
  };

  return (
    <div className="flex flex-col h-[65vh] px-1 sm:px-0">
      {searchSlot && (
        <div className="pb-4 bg-background z-10 shrink-0">
          {searchSlot}
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar">
        <div className="space-y-5">
          <ImageUrlField
            imageUrl={formData.imageUrl}
            onImageChange={(url) =>
              setFormData((prev) => ({ ...prev, imageUrl: url }))
            }
            variant="portrait"
          >
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
              <div className="flex justify-center md:justify-start">
                <ImageUrlField.Preview />
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-70 px-1">
                    Title Name
                  </h3>
                  <input
                    autoComplete="off"
                    placeholder="Enter title name..."
                    value={formData.titleName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, titleName: e.target.value }))
                    }
                    className="h-11 w-full px-3.5 border-2 border-border/80 rounded-xl font-bold text-foreground text-sm focus:border-primary transition-all shadow-sm outline-none bg-background/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-70 px-1">
                    Title Type
                  </h3>
                  <TitleTypeSelect
                    value={formData.titleType}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        titleType: val as TitleType,
                      }))
                    }
                    className="h-11 border-2 border-border/80 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] italic opacity-70 px-1">
                    Source Image URL
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <ImageUrlField.Input />
                    </div>

                    {formData.imageUrl && (
                      <button
                        type="button"
                        onClick={handleClearImage}
                        title="Clear Image"
                        className="h-11 w-11 flex items-center justify-center rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-white border-2 border-danger/20 transition-all shrink-0 active:scale-95"
                      >
                        <DeleteForeverIcon sx={{ fontSize: 20 }} />
                      </button>
                    )}
                  </div>

                  <ImageUrlField.Tip />
                </div>
              </div>
            </div>
          </ImageUrlField>
        </div>
      </div>

      <div className="bg-background shrink-0 pt-4 border-t border-border mt-auto">
        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            className="w-full h-11 font-bold"
            variant="cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="w-full h-11 font-bold"
            variant="save"
          >
            {isPending ? "Saving..." : submitText}
          </Button>
        </div>
      </div>
    </div>
  );
};