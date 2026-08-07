import React, { useState, useMemo } from "react";
import { useManageFavoriteTitles } from "~/features/favoriteTitles/hooks/useManageFavoriteTitles";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";
import { useReorderWatchlist } from "~/entities/titleRecord";
import { useUserProfile } from "../hooks/useUserProfile";

interface SelectFavoriteModalProps {
  position: number;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const SelectFavoriteModal: React.FC<SelectFavoriteModalProps> = ({
  position,
  userId,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addFavorite, isAdding } = useManageFavoriteTitles(userId);

  const { data: userProfile } = useUserProfile(userId);

  const existingFavoriteIds = useMemo(
    () => new Set(userProfile?.favoriteTitles?.map((f) => f.title.titleId) || []),
    [userProfile]
  );

  const queryParams = useMemo(
    () => ({
      limit: 20,
      search: searchQuery || undefined,
    }),
    [searchQuery]
  );

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    queryKey,
  } = useInfinityTitles(isOpen ? userId : null, queryParams);

  const userTitles = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) || [];
  }, [data]);

  const { optimisticTitles } = useReorderWatchlist(
    userTitles,
    queryKey,
    userId
  );

  if (!isOpen) return null;

  const handleSelectTitle = (titleId: number) => {
    if (existingFavoriteIds.has(titleId)) return;

    addFavorite(
      { titleId, position },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card border border-background-muted rounded-2xl p-6 shadow-2xl flex flex-col max-h-[80vh]">

        <div className="flex items-center justify-between pb-4 border-b border-background-muted">
          <h3 className="text-lg font-bold text-foreground">
            Select title for position #{position}
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-xl p-1 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>


        <div className="my-4">
          <input
            type="text"
            placeholder="Search in your titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-background-muted border border-background-muted rounded-xl text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1 overscroll-contain">
          {isLoading ? (
            <div className="text-center py-8 text-muted">Loading...</div>
          ) : optimisticTitles.length ? (
            <>
              {optimisticTitles.map((item) => {
                const isAlreadyAdded = existingFavoriteIds.has(item.titleId);

                return (
                  <div
                    key={item.titleId}
                    onClick={() => handleSelectTitle(item.titleId)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all gap-3 select-none ${isAlreadyAdded
                        ? "bg-background-muted/20 border-transparent opacity-50 cursor-not-allowed"
                        : "bg-background-muted/40 hover:bg-primary/10 hover:border-primary/30 border-transparent cursor-pointer"
                      }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-12 h-16 shrink-0 overflow-hidden rounded-lg bg-background-muted">
                        <img
                          src={item.imageUrl || DEFAULT_IMAGE_PATH}
                          alt={item.titleName}
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_IMAGE_PATH;
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-foreground text-sm line-clamp-2">
                        {item.titleName}
                      </span>
                    </div>

                    <button
                      type="button"
                      disabled={isAdding || isAlreadyAdded}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTitle(item.titleId);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 ${isAlreadyAdded
                          ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-hover cursor-pointer disabled:opacity-50"
                        }`}
                    >
                      {isAlreadyAdded ? "Added" : "Select"}
                    </button>
                  </div>
                );
              })}

              <div className="py-4 flex justify-center">
                <InfiniteScrollLoader
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  fetchNextPage={fetchNextPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted">No titles found</div>
          )}
        </div>
      </div>
    </div>
  );
};