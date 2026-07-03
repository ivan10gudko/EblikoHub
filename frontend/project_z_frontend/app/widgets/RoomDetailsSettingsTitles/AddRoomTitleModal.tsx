import { useState } from "react";
import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { Select } from "~/shared/ui/Select";
import { roomTitleService } from "~/features/manageRooms/api/roomTitleService";
import type { AnimeCardType } from "~/entities/title";
import {
    TitleType,
    titleTypeOptions
} from "~/entities/titleRecord";
import { notify } from "~/shared/lib";
import { TitleSearch } from "../TitleModal/components/titleSearch";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { useRoomTitleActions } from "~/features/manageRooms";

interface AddRoomTitleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    roomId: number;
}

const INITIAL_FORM = {
    titleName: "",
    apiTitleId: "",
    imageUrl: null as string | null,
    titleType: TitleType.ANIME,
};

export const AddRoomTitleModal = ({ isOpen, onClose, onSuccess, roomId }: AddRoomTitleModalProps) => {
    const [formData, setFormData] = useState(INITIAL_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImport = (anime: AnimeCardType) => {
        setFormData({
            ...formData,
            titleName: anime.title,
            apiTitleId: anime.id.toString(),
            imageUrl: anime.img,
        });
        notify.success("Title imported successfully!");
    };

    const { addTitle } = useRoomTitleActions(roomId);

    const handleSave = () => {
        if (!formData.titleName.trim()) {
            notify.error("Title name is required!");
            return;
        }

        addTitle({
            titleName: formData.titleName,
            apiTitleId: Number(formData.apiTitleId || 0),
            titleType: formData.titleType,
            imageUrl: formData.imageUrl,
        });
        notify.success("Added to room!");
        onClose();
        setFormData(INITIAL_FORM);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Room Title" maxWidth="max-w-4xl">
            <div className="flex flex-col h-[70vh] px-1 sm:px-0">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar space-y-6 p-2">

                    <div className="space-y-2">
                        <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
                            Quick Import via MAL
                        </label>
                        <TitleSearch onSelect={handleImport} />
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="border-t border-border/50 pt-6 md:border-t-0 md:pt-0">
                            <ImageUrlEditor
                                imageUrl={formData.imageUrl}
                                onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>

                        <div className="flex-grow space-y-6">
                            {/* Title Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
                                    Title Name
                                </label>
                                <input
                                    autoComplete="off"
                                    placeholder="Enter name..."
                                    value={formData.titleName}
                                    onChange={(e) => setFormData({ ...formData, titleName: e.target.value })}
                                    className="h-12 w-full px-4 border-2 border-border rounded-xl font-bold text-foreground text-sm focus:border-primary transition-all shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-muted-foreground ml-1 uppercase opacity-70">
                                    Title Type
                                </label>
                                <div className="w-full sm:max-w-xs">
                                    <Select
                                        value={formData.titleType}
                                        onChange={(val) => setFormData({ ...formData, titleType: val as TitleType })}
                                        options={[...titleTypeOptions]}
                                        className="h-12 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 bg-background shrink-0 flex gap-4 border-t border-border mt-2">
                    <Button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-xl bg-card text-foreground !font-bold tracking-wider hover:bg-muted transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="flex-[2] h-14 rounded-xl bg-primary text-primary-foreground !font-bold tracking-wider shadow-[0_4px_0_0_#d97706] hover:opacity-90 active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        {isSubmitting ? "Saving..." : "Save Title"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};