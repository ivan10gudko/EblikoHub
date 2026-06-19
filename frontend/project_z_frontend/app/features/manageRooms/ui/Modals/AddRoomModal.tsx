import { useState } from "react";
import type { RoomCreateDto } from "~/entities/room/model/room.types";
import { UserSearchDropdown, UserShortRow, type UserProfile } from "~/entities/user";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import { SearchBar } from "~/features/search";
import { Button } from "~/shared/ui/Button";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";
import { Input } from "~/shared/ui/Input";
import Modal from "~/shared/ui/Modal/Modal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ModalFooter } from "~/shared/ui/Modal";
import { useRoomMutation } from "~/entities/room";

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
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Room" maxWidth="max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-3 md:p-6">

                <div className="space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
                    <ImageUrlEditor
                        imageUrl={formData.imageUrl}
                        onImageChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    />

                    <Input
                        value={formData.roomName}
                        onChange={(val) => setFormData(prev => ({ ...prev, roomName: val }))}
                        placeholder="Enter room name..."
                    />

                    <div className="relative">
                        <SearchBar
                            onSearch={setSearchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search users..."
                            className="bg-card w-full"
                        />
                        {searchQuery && (
                            <UserSearchDropdown
                                results={searchResults}
                                onSelect={handleSelectUser}
                                onClose={() => setSearchQuery("")}
                                isLoading ={isLoading}
                            />
                        )}
                    </div>
                </div>

                <div className="bg-background-muted/30 rounded-xl p-3 md:p-4 border border-border">
                    <h4 className="text-[10px] md:text-xs font-bold uppercase text-muted-foreground mb-3">
                        Added Members ({addedUsers.length})
                    </h4>

                    <div className="space-y-2 max-h-[200px] md:max-h-[300px] overflow-y-auto custom-scrollbar">
                        {addedUsers.length === 0 ? (
                            <p className="text-xs text-muted-foreground italic text-center py-4">No users added yet</p>
                        ) : (
                            addedUsers.map(user => (
                                <UserShortRow key={user.userId} user={user} action={
                                    <Button onClick={() => handleRemoveUser(user.userId)} className="text-danger p-1">
                                        <DeleteOutlineIcon fontSize="small" />
                                    </Button>
                                } />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <ModalFooter
                onCancel={onClose}
                onSave={handleSave}
                isSaving={isCreating}
                saveLabel="Create Room"
            />
        </Modal>
    );
};