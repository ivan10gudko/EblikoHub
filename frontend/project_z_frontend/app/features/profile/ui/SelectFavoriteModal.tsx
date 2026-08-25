import React, { useState, useMemo } from "react";
import { useManageFavoriteTitles } from "~/features/profile/hooks/useManageFavoriteTitles";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { useInfinityTitles } from "~/entities/titleRecord/hooks/useInfinityTitles";
import { useReorderWatchlist, TitleTypeThemes } from "~/entities/titleRecord";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { TitleHoverPreview } from "~/shared/ui/HoverPreviewImage";
import { Button } from "~/shared/ui/Button";
import SearchBar from "~/shared/ui/SearchBar";
import type { FavoriteTitleItem } from "../model/favorite.types";
import { Modal } from "~/shared/ui/Modal";

interface SelectFavoriteModalProps {
  position: number;
  userId: string;
  favoriteTitles: FavoriteTitleItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const SelectFavoriteModal: React.FC<SelectFavoriteModalProps> = ({
  position,
  userId,
  favoriteTitles,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { addFavorite, isAdding } = useManageFavoriteTitles(userId);

  const existingFavoriteIds = useMemo(
    () => new Set(favoriteTitles?.map((f) => f.title.titleId) || []),
    [favoriteTitles]
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Select title for position #${position}`}
      maxWidth="max-w-lg"
      className="h-[80vh] max-h-[600px]"
    >
      <div className="flex flex-col h-full gap-3">
        <div className="shrink-0 h-10 min-h-[40px]">
          <SearchBar
            onSearch={setSearchQuery}
            debounceMs={300}
            placeholder="Search in your titles..."
            className="w-full h-full max-w-none rounded-xl bg-background-muted border-border"
          />
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto space-y-2 pr-1 overscroll-contain min-h-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full text-foreground-muted">
              Loading...
            </div>
          ) : optimisticTitles.length ? (
            <>
              {optimisticTitles.map((item) => {
                const isAlreadyAdded = existingFavoriteIds.has(item.titleId);
                const themeClasses = item.titleType
                  ? TitleTypeThemes[item.titleType]
                  : "";

                return (
                  <div
                    key={item.titleId}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all gap-3 select-none ${themeClasses} ${isAlreadyAdded
                        ? "opacity-50 border-transparent"
                        : "hover:border-primary/40"
                      }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <TitleHoverPreview
                        imageUrl={item.imageUrl ?? DEFAULT_IMAGE_PATH}
                        titleName={item.titleName}
                      />

                      <span className="font-semibold text-foreground text-sm line-clamp-2">
                        {item.titleName}
                      </span>
                    </div>

                    <Button
                      type="button"
                      disabled={isAdding || isAlreadyAdded}
                      onClick={() => handleSelectTitle(item.titleId)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors shrink-0 h-auto ${isAlreadyAdded
                          ? "bg-background-muted text-foreground-muted cursor-not-allowed border border-border hover:bg-background-muted"
                          : "bg-primary text-background hover:bg-primary-hover cursor-pointer disabled:opacity-50"
                        }`}
                    >
                      {isAlreadyAdded ? "Added" : "Select"}
                    </Button>
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
            <div className="flex items-center justify-center h-full text-foreground-muted">
              No titles found
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};