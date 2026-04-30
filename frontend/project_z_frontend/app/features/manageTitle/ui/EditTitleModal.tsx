
import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { useState } from "react";
import type { TitleRecord, Status } from "~/entities/titleRecord";
import { CompactRate } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { StatusSelect } from "~/features/manageTitle";
import toast from "react-hot-toast";
import { TitleImageEditor } from "~/features/manageTitle";

interface EditTitleModalProps {
    title: TitleRecord;
    isOpen: boolean;
    onClose: () => void;
}

export const EditTitleModal = ({ title, isOpen, onClose }: EditTitleModalProps) => {
    const [titleName, setTitleName] = useState(title.titleName);
    const [imageUrl, setImageUrl] = useState<string | null>(title.imageUrl ?? null);
    const [status, setStatus] = useState<Status>(title.status);
    const [rating, setRating] = useState<number | undefined>(title.rating?.overall);

    const { updateTitle, isUpdating } = useUpdateTitleRecord(title.titleId);

    const handleSave = () => {
        if (!titleName.trim()) {
            toast.error("Title name cannot be empty");
            return;
        }

        updateTitle(
            { 
                titleName, 
                imageUrl, 
                status, 
                rating: rating !== undefined ? { overall: rating } : undefined 
            },
            {
                onSuccess: () => {
                    toast.success("Updated successfully");
                    onClose();
                },
            }
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Record" maxWidth="max-w-xl">
            <div className="space-y-8 p-2">
                <TitleImageEditor
                    imageUrl={imageUrl}
                    onImageChange={setImageUrl}
                />

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

                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <StatusSelect
                                variant="page"
                                initialData={title}
                                titleRecord={{ ...title, status }} 
                                className="h-12 w-full border-2 border-border rounded-xl bg-background"
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

                <div className="flex gap-3 pt-6 border-t border-border">
                    <Button onClick={onClose} variant="outline" className="text-foreground  bg-card border-none flex-1 h-14 rounded-xl font-bold">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
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