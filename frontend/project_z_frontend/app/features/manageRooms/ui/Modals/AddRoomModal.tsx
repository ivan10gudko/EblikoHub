import { useState, useEffect, useCallback } from "react";
import type { RoomCreateDto } from "~/entities/room/model/room.types";
import { type UserProfile } from "~/entities/user";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import Modal from "~/shared/ui/Modal/Modal";
import { ModalFooter } from "~/shared/ui/Modal";
import { useRoomMutation } from "~/entities/room";
import { RoomInfoStep } from "./addRoomModalComponents/RoomInfoStep";
import { MembersStep } from "./addRoomModalComponents/RoomMembersStep";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  onStepChange: (step: number) => void;
}

export const AddRoomModal = ({
  isOpen,
  onClose,
  step,
  onStepChange,
}: AddRoomModalProps) => {
  const [formData, setFormData] = useState<RoomCreateDto>({
    roomName: "",
    members: [],
    imageUrl: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);

  const { searchResults, isLoading } = useUserSearch(searchQuery);
  const { createRoom, isCreating } = useRoomMutation();

  useEffect(() => {
    if (!isOpen) {
      setFormData({ roomName: "", members: [], imageUrl: null });
      setAddedUsers([]);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!formData.roomName.trim()) return;

    createRoom(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleSelectUser = useCallback((user: UserProfile) => {
    if (!addedUsers.find((u) => u.userId === user.userId)) {
      setAddedUsers([...addedUsers, user]);
      setFormData((prev) => ({
        ...prev,
        members: [...prev.members, user.userId],
      }));
    }
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    setAddedUsers(addedUsers.filter((u) => u.userId !== userId));
    setFormData((prev) => ({
      ...prev,
      members: prev.members.filter((id) => id !== userId),
    }));
  }, []);

  const stepsContent = [
    <RoomInfoStep key="info" formData={formData} setFormData={setFormData} />,
    <MembersStep
      key="members"
      addedUsers={addedUsers}
      onSearch={setSearchQuery}
      searchResults={searchResults}
      onSelect={handleSelectUser}
      onRemove={handleRemoveUser}
      isLoading={isLoading}
    />,
  ];

  const totalSteps = stepsContent.length;
  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  const handleNext = () => onStepChange(Math.min(step + 1, totalSteps));
  const handleBack = () => onStepChange(Math.max(step - 1, 1));

  const renderFooter = () => (
    <ModalFooter
      onCancel={isFirstStep ? onClose : handleBack}
      cancelLabel={isFirstStep ? "Cancel" : "Back"}
      onSave={isLastStep ? handleSave : handleNext}
      isSaving={isCreating}
      saveLabel={isLastStep ? "Create Room" : "Next"}
    />
  );

  const currentStepIndex = Math.min(Math.max(step - 1, 0), totalSteps - 1);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create New Room (${step}/${totalSteps})`}
      maxWidth="max-w-4xl"
    >
      <div className="p-3 md:p-6 min-h-[400px]">
        {stepsContent[currentStepIndex]}
      </div>

      {renderFooter()}
    </Modal>
  );
};
