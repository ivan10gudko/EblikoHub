import { useRoomModal } from "../../hooks/useRoomModal";
import { AddRoomModal } from "./AddRoomModal";

export const GlobalModalManager = () => {
  const { isAddOpen, step, setRoomStep, closeAllModals } = useRoomModal();

  if (!isAddOpen) return null;

  return (
    <AddRoomModal
      isOpen
      onClose={closeAllModals}
      step={step}
      onStepChange={setRoomStep}
    />
  );
};