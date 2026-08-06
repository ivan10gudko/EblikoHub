import React from "react";
import { useManageFavoriteTitles } from "~/features/favoriteTitles/hooks/useManageFavoriteTitles";
import type { UserProfileDto } from "~/features/favoriteTitles/model/favorite.types";

interface UserFavoriteTitlesShowcaseProps {
    profile: UserProfileDto;
    isOwner: boolean;
    maxPositions?: number;
    onAddClick?: (position: number) => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const UserFavoriteTitlesShowcase: React.FC<UserFavoriteTitlesShowcaseProps> = ({
    profile,
    isOwner,
    maxPositions = 3,
    onAddClick,
}) => {
    const { deleteFavorite, isDeleting } = useManageFavoriteTitles(profile.userId);
    
    const favoriteTitles = (profile as UserProfileDto).favoriteTitles || [];

    const slots = Array.from({ length: maxPositions }, (_, index) => {
        const position = index + 1;
        const item = favoriteTitles.find((f) => f.position === position) || null;
        return { position, item };
    });

    return (
        <section className="w-full mt-4">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="text-amber-400">★</span> Top-{maxPositions} Favorites
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {slots.map(({ position, item }) => (
                    <div
                        key={position}
                        className="relative aspect-[2/3] group rounded-2xl overflow-hidden border border-background-muted bg-card shadow-md"
                    >
                        {/* Position Badge */}
                        <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 text-xs font-black text-amber-400 pointer-events-none">
                            #{position}
                        </div>

                        {item ? (
                            <>
                                {/* Poster Image */}
                                <img
                                    src={(item.title as any)?.imageUrl || (item.title as any)?.poster || DEFAULT_IMAGE_PATH}
                                    alt={item.title.titleName}
                                    onError={(e) => {
                                        // Якщо URL битий — підставляємо дефолтну картинку
                                        e.currentTarget.src = DEFAULT_IMAGE_PATH;
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                
                                {/* Overlay gradient & Title Name */}
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/20 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                                    <h3 className="text-sm font-bold text-foreground line-clamp-2">
                                        {item.title.titleName}
                                    </h3>
                                </div>

                                {/* Delete Button */}
                                {isOwner && (
                                    <button
                                        type="button"
                                        onClick={() => deleteFavorite(item.id)}
                                        className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-background/80 border border-white/10 text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </>
                        ) : isOwner ? (
                            /* Add Favorite Slot Button */
                            <button
                                type="button"
                                onClick={() => {
                                    if (onAddClick) {
                                        onAddClick(position);
                                    }
                                }}
                                className="w-full h-full flex flex-col items-center justify-center p-4 border-2 border-dashed border-background-muted hover:border-primary/50 hover:bg-primary/5 transition-all group/btn cursor-pointer z-10 relative"
                            >
                                <div className="w-10 h-10 rounded-full bg-background-muted group-hover/btn:bg-primary text-muted group-hover/btn:text-white flex items-center justify-center mb-2 transition-colors pointer-events-none">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold text-muted group-hover/btn:text-primary pointer-events-none">
                                    Add to position #{position}
                                </span>
                            </button>
                        ) : (
                            /* Empty Slot for Guests */
                            <div className="w-full h-full flex items-center justify-center text-xs text-muted font-mono">
                                Empty
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};