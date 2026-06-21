import { useSearchParams } from "react-router";

import type { ModalType } from "~/shared/types";

export const useRoomModal = () => {
  const [, setSearchParams] = useSearchParams();

  const open = (type: ModalType, initialStep = '1') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('modal', type);
      next.set('step', initialStep);
      return next;
    });
  };

  const close = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('modal');
      next.delete('step');
      return next;
    });
  };

  return { open, close };
};
