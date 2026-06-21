import { useState } from "react";
import type { RoomCreateDto } from "~/entities/room/model/room.types";
import { UserSearchDropdown, UserShortRow, type UserProfile } from "~/entities/user";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import { SearchBar } from "~/features/search";
import { Button } from "~/shared/ui/Button";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { Input } from "~/shared/ui/Input";
import Modal from "~/shared/ui/Modal/Modal";
import { ModalFooter } from "~/shared/ui/Modal";
import { useRoomMutation } from "~/entities/room";
import { RoomInfoStep } from "./addRoomModalComponents/RoomInfoStep";
import { MembersStep } from "./addRoomModalComponents/RoomMembersStep";

interface AddRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddRoomModal = ({ isOpen, onClose }: AddRoomModalProps) => {
    const [formData, setFormData] = useState<RoomCreateDto>({
        roomName: "",
        members: [],
        imageUrl: null,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [step, setStep] = useState(1);
    const { searchResults, isLoading } = useUserSearch(searchQuery);
    const { createRoom, isCreating } = useRoomMutation();
    const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);
    const handleSave = () => {
        if (!formData.roomName.trim()) {
            return;
        }
        createRoom(formData, {
            onSuccess: () => {
                onClose();
            }
        });
    };
    const renderFooter = () => (
        <ModalFooter
            onCancel={step === 1 ? onClose : () => setStep(1)}
            cancelLabel={step === 1 ? "Cancel" : "Back"}
            onSave={step === 1 ? () => setStep(2) : handleSave}
            isSaving={isCreating}
            saveLabel={step === 1 ? "Next" : "Create Room"}
        />
    );

    const handleSelectUser = (user: UserProfile) => {
        if (!addedUsers.find(u => u.userId === user.userId)) {
            setAddedUsers([...addedUsers, user]);
            setFormData(prev => ({ ...prev, members: [...prev.members, user.userId] }));
        }
    };

    const handleRemoveUser = (userId: string) => {
        setAddedUsers(addedUsers.filter(u => u.userId !== userId));
        setFormData(prev => ({ ...prev, members: prev.members.filter(id => id !== userId) }));
    };

        return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Create New Room (${step}/2)`} maxWidth="max-w-4xl">
            <div className="p-3 md:p-6 min-h-[400px]">
                {step === 1 ? (
                    <RoomInfoStep formData={formData} setFormData={setFormData} />
                ) : (
                    <MembersStep
                        addedUsers={addedUsers}
                        onSearch={setSearchQuery}
                        searchResults={searchResults}
                        onSelect={handleSelectUser}
                        onRemove={handleRemoveUser}
                        isLoading={isLoading}
                    />
                )}
            </div>

            {renderFooter()}
        </Modal>
    );
};