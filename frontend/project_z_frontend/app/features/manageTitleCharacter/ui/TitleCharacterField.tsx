import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { CharacterCard, type Character } from "~/entities/character";
import { CharacterPicker } from "~/features/selectCharacter";
import { Button } from "~/shared/ui/Button";

interface TitleCharacterFieldProps {
  value: Character | null;
  onChange: (character: Character | null) => void;
  disabled?: boolean;
}

/** Controlled favorite character field for the Edit title form (saved together with the form). */
export const TitleCharacterField = ({ value, onChange, disabled }: TitleCharacterFieldProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between p-3 border-2 border-border/60 bg-background/50 rounded-xl">
      {value ? (
        <CharacterCard character={value} imageClassName="w-16 h-22" />
      ) : (
        <span className="text-sm text-muted-foreground italic opacity-60 px-1">Not selected</span>
      )}

      <div className="flex gap-2 shrink-0">
        <CharacterPicker
          selectedId={value?.id}
          disabled={disabled}
          align="end"
          side="top"
          onSelect={onChange}
          trigger={
            value ? (
              <Button
                variant="accept"
                disabled={disabled}
                className="h-9 px-3 gap-1.5 text-xs font-bold"
              >
                <EditIcon sx={{ fontSize: 16 }} />
                Change
              </Button>
            ) : undefined
          }
        />
        {value && (
          <Button
            variant="altCancel"
            disabled={disabled}
            onClick={() => onChange(null)}
            className="h-9 px-3 text-xs font-bold"
            title="Unlink from title (character stays in your list)"
          >
            <CloseIcon sx={{ fontSize: 16 }} />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
