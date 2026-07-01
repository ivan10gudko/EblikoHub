import { AddRoomModal } from "~/features/manageRooms";
import { useRoomModal } from "../hooks/useRoomModal";

export const RoomModalManager = () => {
  const { isAddOpen, step, close, setStep } = useRoomModal();

  return (
    <AddRoomModal
      isOpen={isAddOpen}
      onClose={close}
      step={step}
      onStepChange={setStep}
    />
  );
};
