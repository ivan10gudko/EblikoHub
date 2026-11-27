import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import type { UserProfileWithFavorite } from "~/features/profile";
import {
  MAX_FAVORITE_CHARACTERS,
  useManageFavoriteCharacters,
} from "~/features/manageFavoriteCharacters";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { AddNewButton } from "~/shared/ui/AddNewButton";
import { Button } from "~/shared/ui/Button";

interface UserFavoriteCharactersShowcaseProps {
  profile: UserProfileWithFavorite;
  isOwner: boolean;
  maxPositions?: number;
  onAddClick?: (position: number) => void;
}

export const UserFavoriteCharactersShowcase: React.FC<UserFavoriteCharactersShowcaseProps> = ({
  profile,
  isOwner,
  maxPositions = MAX_FAVORITE_CHARACTERS,
  onAddClick,
}) => {
  const { deleteFavorite, isDeleting } = useManageFavoriteCharacters(profile.userId);
  const favorites = profile.favoriteCharacters || [];

  if (!isOwner && favorites.length === 0) return null;

  const slots = Array.from({ length: maxPositions }, (_, index) => {
    const position = index + 1;
    const item = favorites.find((f) => f.position === position) || null;
    return { position, item };
  });

  return (
    <section className="w-full mt-4">
      <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <FavoriteIcon className="text-primary" fontSize="small" /> Top-{maxPositions} Characters
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {slots.map(({ position, item }) => (
          <div
            key={position}
            className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-background-muted bg-card shadow-md"
          >
            <div className="absolute top-2.5 left-2.5 z-20 px-2.5 h-7 rounded-md bg-card/75 backdrop-blur-md border border-white/10 flex items-center justify-center select-none pointer-events-none">
              <span className="text-xs font-bold text-primary leading-none pt-[1px]">
                #{position}
              </span>
            </div>

            {item ? (
              <>
                <img
                  src={item.character.imageUrl || DEFAULT_IMAGE_PATH}
                  alt={item.character.name}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_IMAGE_PATH;
                  }}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end gap-1.5 p-4 pointer-events-none">
                  <h3 className="text-sm font-bold text-foreground line-clamp-2">
                    {item.character.name}
                  </h3>
                </div>

                {isOwner && (
                  <Button
                    type="button"
                    variant="altCancel"
                    disabled={isDeleting}
                    onClick={() => deleteFavorite(item.id)}
                    className="absolute top-2.5 right-2.5 z-30 !w-9 !h-9 !p-0 rounded-md bg-danger/75 text-card/70 hover:text-card/90 hover:bg-danger/90 transition-all duration-200 hover:scale-110 flex items-center justify-center cursor-pointer shrink-0"
                    aria-label="Remove character"
                  >
                    <DeleteForeverIcon sx={{ fontSize: 30 }} />
                  </Button>
                )}
              </>
            ) : isOwner ? (
              <AddNewButton
                variant="card"
                placeholder={`character #${position}`}
                onClick={() => onAddClick?.(position)}
                className="h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-foreground-muted font-mono">
                Empty
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
