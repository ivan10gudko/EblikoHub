import { useState, useCallback } from "react";
import type { RoomCreateDto } from "~/entities/room/model/room.types";
import { type UserProfile } from "~/entities/user";
import { useUserSearch } from "~/entities/user/hooks/useUserSearch";
import { ModalFooter } from "~/shared/ui/Modal";
import { RoomInfoStep } from "./addRoomModalComponents/RoomInfoStep";
import { MembersStep } from "./addRoomModalComponents/RoomMembersStep";
import { validateStep } from "../../helpers/validateRoomStep";
import { useRoomMutation } from "../../hooks/useRoomMutation";

interface AddRoomScreenProps {
  onClose: () => void;
  step: number;
  onStepChange: (step: number) => void;
}

export const AddRoomScreen = ({
  onClose,
  step,
  onStepChange,
}: AddRoomScreenProps) => {
  const [formData, setFormData] = useState<RoomCreateDto>({
    roomName: "",
    members: [],
    imageUrl: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [addedUsers, setAddedUsers] = useState<UserProfile[]>([]);

  const { searchResults, isLoading } = useUserSearch(searchQuery);
  const { createRoom, isCreating } = useRoomMutation();

  const handleSave = () => {
    createRoom(formData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleSelectUser = useCallback((user: UserProfile) => {
    setAddedUsers((prevUsers) => {
      if (prevUsers.some((u) => u.userId === user.userId)) {
        return prevUsers;
      }

      setFormData((prevForm) => ({
        ...prevForm,
        members: [...prevForm.members, user.userId],
      }));

      return [...prevUsers, user];
    });
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    setAddedUsers((prevUsers) => prevUsers.filter((u) => u.userId !== userId));
    setFormData((prevForm) => ({
      ...prevForm,
      members: prevForm.members.filter((id) => id !== userId),
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

  const handleNext = () => {
    if (validateStep(step, formData)) {
      onStepChange(Math.min(step + 1, totalSteps));
    }
  };

  const handleBack = () => onStepChange(Math.max(step - 1, 1));

  const currentStepIndex = Math.min(Math.max(step - 1, 0), totalSteps - 1);

  return (
    <div className="flex flex-col h-[65vh] px-1 sm:px-0">
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-3 custom-scrollbar p-3 md:p-6">
        {stepsContent[currentStepIndex]}
      </div>

      <div className="bg-background shrink-0">
        <ModalFooter
          onCancel={isFirstStep ? onClose : handleBack}
          cancelLabel={isFirstStep ? "Cancel" : "Back"}
          onSave={isLastStep ? handleSave : handleNext}
          isSaving={isCreating}
          saveLabel={isLastStep ? "Create Room" : "Next"}
        />
      </div>
    </div>
  );
};