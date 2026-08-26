import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import { useManageFavoriteTitles } from "~/features/manageFavoriteTitles/hooks/useManageFavoriteTitles";
import type { UserProfileWithFavorite } from "~/features/profile";
import { ViewTitleModal } from "~/entities/titleRecord/ui/ViewTitleModal";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { AddNewButton } from "~/shared/ui/AddNewButton";
import CloseIcon from "@mui/icons-material/Close";
import type { TitleShort } from "~/entities/titleRecord";

interface UserFavoriteTitlesShowcaseProps {
  profile: UserProfileWithFavorite;
  isOwner: boolean;
  maxPositions?: number;
  onAddClick?: (position: number) => void;
}

export const UserFavoriteTitlesShowcase: React.FC<UserFavoriteTitlesShowcaseProps> = ({
  profile,
  isOwner,
  maxPositions = 3,
  onAddClick,
}) => {
  const { deleteFavorite } = useManageFavoriteTitles(profile.userId);
  const [selectedTitle, setSelectedTitle] = useState<TitleShort | null>(null);

  const favoriteTitles = profile.favoriteTitles || [];

  const slots = Array.from({ length: maxPositions }, (_, index) => {
    const position = index + 1;
    const item = favoriteTitles.find((f) => f.position === position) || null;
    return { position, item };
  });

  return (
    <>
      <section className="w-full mt-4">
        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <StarIcon className="text-primary" fontSize="small" /> Top-{maxPositions} Favorites
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {slots.map(({ position, item }) => (
            <div
              key={position}
              onClick={() => {
                if (!isOwner && item?.title) {
                  setSelectedTitle(item.title);
                }
              }}
              className={`relative aspect-[2/3] rounded-2xl overflow-hidden border border-background-muted bg-card shadow-md ${!isOwner && item ? "cursor-pointer" : ""
                }`}
            >
              <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-xs font-black text-amber-400 pointer-events-none">
                #{position}
              </div>

              {item ? (
                <>
                  <img
                    src={item.title.imageUrl || DEFAULT_IMAGE_PATH}
                    alt={item.title.titleName}
                    onError={(e) => {
                      e.currentTarget.src = DEFAULT_IMAGE_PATH;
                    }}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                    <h3 className="text-sm font-bold text-foreground line-clamp-2">
                      {item.title.titleName}
                    </h3>
                  </div>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFavorite(item.id);
                      }}
                      className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-background/80 border border-border text-danger hover:bg-danger hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      <CloseIcon sx={{ fontSize: 16 }} />
                    </button>
                  )}
                </>
              ) : isOwner ? (
                <div className="w-full h-full">
                  <AddNewButton
                    variant="card"
                    placeholder={`position #${position}`}
                    onClick={() => onAddClick?.(position)}
                    className="h-full"
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-foreground-muted font-mono">
                  Empty
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {!isOwner && (
        <ViewTitleModal
          titleId={selectedTitle?.titleId ?? null}
          isOpen={Boolean(selectedTitle)}
          onClose={() => setSelectedTitle(null)}
          isOwn={false}
        />
      )}
    </>
  );
};