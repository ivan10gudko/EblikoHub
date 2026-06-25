
import type { RoomCreateDto } from "~/entities/room";
import { notify } from "~/shared/lib";

export const validateStep = (step: number, formData: RoomCreateDto): boolean => { // mb i should use useForm, but now it is only 1 field to validate
  if (step === 1) {
    if (!formData.roomName.trim()) {
      notify.error("Room name must not be empty!");
      return false;
    }
  }

  return true;
};