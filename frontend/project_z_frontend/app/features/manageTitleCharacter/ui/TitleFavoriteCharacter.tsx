import FavoriteIcon from "@mui/icons-material/Favorite";
import { CharacterCard, type Character } from "~/entities/character";

interface TitleFavoriteCharacterProps {
  character?: Character | null;
}

/** Read-only favorite character block for the title info view. Editing lives in the Edit modal. */
export const TitleFavoriteCharacter = ({ character }: TitleFavoriteCharacterProps) => {
  return (
    <div className="space-y-2 border-t border-border/40 pt-4">
      <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60 flex items-center gap-1.5 ml-1">
        <FavoriteIcon sx={{ fontSize: 14 }} className="text-primary" />
        Favorite Character
      </span>

      <div className="p-3 border-2 border-border/60 bg-card/30 rounded-xl">
        {character ? (
          <CharacterCard character={character} />
        ) : (
          <span className="text-sm text-muted-foreground italic opacity-60 px-1">
            Not selected
          </span>
        )}
      </div>
    </div>
  );
};
