import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Select } from "~/shared/ui/Select";
import type { AnimeCardType } from "~/entities/title";
import {
  Status,
  statusOptions,
  useCreateTitleRecord,
  type CreateTitleRecord,
  type TitleRating,
} from "~/entities/titleRecord";
import toast from "react-hot-toast";
import { useState } from "react";
import { TitleSearch } from "../TitleSearch/titleSearch";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { formatRatingInput } from "~/shared/helpers/formatRating";
import { TitleImageEditor } from "~/features/manageTitle";

interface AddTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM_DATA: CreateTitleRecord = {
  titleName: "",
  apiTitleId: undefined,
  status: Status.INPROGRESS,
  imageUrl: null,
  rating: undefined,
};

export const AddTitleModal = ({ isOpen, onClose }: AddTitleModalProps) => {
  const [formData, setFormData] =
    useState<CreateTitleRecord>(INITIAL_FORM_DATA);
  const { createNewTitleRecord, isCreating } = useCreateTitleRecord();

  const handleImport = (anime: AnimeCardType) => {
    setFormData({
      ...formData,
      titleName: anime.title,
      apiTitleId: anime.id,
      imageUrl: anime.img,
    });
  };
  const handleClear = () => {
    setFormData(INITIAL_FORM_DATA);
    toast.success("Form cleared");
  };
  const handleSave = () => {
    if (!formData.titleName.trim()) {
      toast.error("Enter name!");
      return;
    }

    createNewTitleRecord(formData, {
      onSuccess: () => {
        toast.success("Added!");
        setFormData(INITIAL_FORM_DATA);
        onClose();
      },
    });
  };
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRatingInput(e.target.value);

    if (formatted !== null) {
      setFormData((prev) => ({
        ...prev,
        rating: {
          ...prev.rating,
          overall: formatted as unknown as number,
        },
      }));
    }
  };
  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Title"
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6 p-2">
        <div className="space-y-2">
          <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
            Quick Import via MAL
          </label>
          <TitleSearch onSelect={handleImport} />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="border-t border-border/50 pt-6">
            <TitleImageEditor
              imageUrl={formData.imageUrl ?? null}
              onImageChange={handleImageChange}
            />
          </div>
          <div className="flex-grow space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight">
                Title Name
              </label>
              <input
                name="Title name"
                autoComplete="off"
                placeholder="Enter name..."
                value={formData.titleName}
                onChange={(e) =>
                  setFormData({ ...formData, titleName: e.target.value })
                }
                className="h-12 w-full px-4  border-2 border-border rounded-xl font-bold text-foreground text-sm focus:border-primary transition-all shadow-sm"
              />
            </div>
            <div className="w-full">
              <div className="flex gap-4 mb-1">
                <div className="flex-1">
                  <label className="text-xs font-bold tracking-widest text-foreground ml-1 uppercase">
                    Status
                  </label>
                </div>
                <div className="w-[112px] flex-shrink-0">
                  <label className="text-xs font-bold tracking-widest text-foreground uppercase text-center block">
                    Rating
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                  <Select
                    value={formData.status}
                    onChange={(val) =>
                      setFormData({ ...formData, status: val as Status })
                    }
                    options={[...statusOptions]}
                    className="h-12 border-2 border-border rounded-xl font-bold text-foreground text-sm shadow-sm"
                  />
                </div>
                <div className="w-[112px] flex-shrink-0">
                  <input
                    name="Rating"
                    autoComplete="off"
                    placeholder="0.0"
                    value={formData.rating?.overall?.toString() || ""}
                    onChange={handleRatingChange}
                    className="h-12 w-full border-2 border-border rounded-xl font-bold text-foreground text-center focus:border-primary transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-6 border-t border-border">
          <Button
            onClick={onClose}
            className="flex-1 h-14 rounded-xl bg-card text-foreground !font-bold tracking-wider hover:bg-card transition-all active:scale-95 shadow-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isCreating}
            className="flex-[2] h-14 rounded-xl bg-primary text-foreground !font-bold tracking-wider shadow-[0_4px_0_0_#d97706] hover:primary-hover active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
          >
            {isCreating ? "Saving..." : "Save Title"}
          </Button>
          <div className="flex justify-center">
            <Button
              onClick={handleClear}
              variant="text-only"
              className="flex items-center gap-2 text-[10px] tracking-widest text-foreground hover:text-danger transition-colors uppercase py-2 px-4"
            >
              <DeleteSweepIcon sx={{ fontSize: 16 }} />
              Clear Form Data
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

