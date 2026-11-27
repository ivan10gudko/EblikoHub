import { useMemo } from "react";
import { Modal } from "~/shared/ui/Modal";
import { CharacterPickerPanel } from "~/features/selectCharacter";
import { useManageFavoriteCharacters } from "../hooks/useManageFavoriteCharacters";
import type { FavoriteCharacterItem } from "../model/favoriteCharacter.types";

interface SelectFavoriteCharacterModalProps {
  position: number;
  userId: string;
  favoriteCharacters: FavoriteCharacterItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const SelectFavoriteCharacterModal = ({
  position,
  userId,
  favoriteCharacters,
  isOpen,
  onClose,
}: SelectFavoriteCharacterModalProps) => {
  const { addFavorite, isAdding } = useManageFavoriteCharacters(userId);

  const excludeIds = useMemo(
    () => favoriteCharacters.map((f) => f.character.id),
    [favoriteCharacters]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Select character for position #${position}`}
      maxWidth="max-w-lg"
      className="h-[80vh] max-h-[600px]"
    >
      <div className="-m-6 h-[calc(100%+3rem)] flex flex-col">
        <CharacterPickerPanel
          className="h-full"
          excludeIds={excludeIds}
          isBusy={isAdding}
          onSelect={(character) =>
            addFavorite(
              { characterId: character.id, position },
              { onSuccess: () => onClose() }
            )
          }
        />
      </div>
    </Modal>
  );
};
