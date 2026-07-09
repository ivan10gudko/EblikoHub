import { useState } from "react";
import Modal from "~/shared/ui/Modal/Modal";
import { Button } from "~/shared/ui/Button";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { notify } from "~/shared/lib";
import { TitleType } from "~/entities/titleRecord";
import TitleTypeSelect from "~/entities/titleRecord/ui/TitleTypeSelect";
import type { RoomTitleDetails } from "~/features/manageRooms/model/roomTitle.types";
import { useRoomTitleActions } from "~/features/manageRooms";

interface EditRoomTitleModalProps {
    isOpen: boolean;
    onClose: () => void;
    roomId: number;
    item: RoomTitleDetails;
}

export const EditRoomTitleModal = ({ isOpen, onClose, roomId, item }: EditRoomTitleModalProps) => {
    const { updateTitle, isPending } = useRoomTitleActions(roomId);
    
    const [formData, setFormData] = useState({
        titleName: item.titleName,
        imageUrl: item.imageUrl || null,
        titleType: item.titleType !== undefined ? item.titleType : TitleType.ANIME,
        apiTitleId: item.apiTitleId !== undefined ? item.apiTitleId : undefined,
    });

    const handleSave = () => {
        if (!formData.titleName.trim()) {
            notify.error("Title name is required!");
            return;
        }

        updateTitle({
            titleId: item.id,
            data: {
                ...formData,
                apiTitleId: formData.apiTitleId ?? undefined,
                imageUrl: formData.imageUrl ?? undefined,
            }
        });
        notify.success("Title updated!");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Room Title" maxWidth="max-w-4xl">
            <div className="flex flex-col px-1 sm:px-0 relative">
                
               
                <div className="flex-1 overflow-y-auto hide-scrollbar pr-1 sm:pr-3 space-y-6 p-2 pb-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        
                        
                        <div className="shrink-0">
                            <ImageUrlEditor
                                imageUrl={formData.imageUrl}
                                onImageChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            />
                        </div>

                        
                        <div className="flex-grow space-y-6">
                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-foreground ml-1 leading-tight uppercase">
                                    Title Name
                                </label>
                                <input
                                    autoComplete="off"
                                    placeholder="Enter name..."
                                    value={formData.titleName}
                                    onChange={(e) => setFormData({ ...formData, titleName: e.target.value })}
                                    className="h-12 w-full px-4 border-2 border-border rounded-xl font-bold text-foreground bg-transparent text-sm focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>

                            
                            <div className="space-y-2">
                                <label className="text-xs font-bold tracking-widest text-muted-foreground ml-1 uppercase opacity-70">
                                    Title Type
                                </label>
                                <div className="w-full sm:max-w-xs">
                                    <TitleTypeSelect
                                        value={formData.titleType}
                                        onChange={(val) => setFormData({ ...formData, titleType: val as TitleType })}
                                        className="h-12 border-2 border-border/60 rounded-xl font-bold text-foreground text-sm shadow-sm w-full"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                
                <div className="pt-4 bg-background shrink-0 flex gap-4 border-t border-border mt-auto">
                    <Button
                        onClick={onClose}
                        className="flex-1 h-14 rounded-xl bg-card text-foreground !font-bold tracking-wider hover:bg-card transition-all active:scale-95 shadow-sm"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="flex-[2] h-14 rounded-xl bg-primary text-foreground !font-bold tracking-wider shadow-[0_4px_0_0_#d97706] hover:primary-hover active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

            </div>
        </Modal>
    );
};