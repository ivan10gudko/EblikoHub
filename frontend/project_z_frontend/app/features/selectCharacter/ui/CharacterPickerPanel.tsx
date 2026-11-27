import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import {
  EXTERNAL_CHARACTER_MIN_QUERY,
  useExternalCharacterSearch,
  useMyCharacters,
  useResolveCharacter,
  type Character,
  type CharacterChoice,
  type CreateCharacter,
} from "~/entities/character";
import { useDebounce } from "~/shared/hooks";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { Button } from "~/shared/ui/Button";
import { InfiniteScrollLoader } from "~/shared/ui/infinityScroll";
import { cn, notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";
import { CustomCharacterForm } from "./CustomCharacterForm";

type PickerTab = "api" | "own";

export interface CharacterPickerPanelProps {
  /** Called with a character from the user's catalog (API results and custom ones are created first). */
  onSelect: (character: Character) => void;
  /** Characters that can't be picked (e.g. already in profile favorites). */
  excludeIds?: string[];
  /** Currently selected character, highlighted in "Yours". */
  selectedId?: string | null;
  /** Disables the list while the parent is saving the choice. */
  isBusy?: boolean;
  autoFocus?: boolean;
  className?: string;
}

interface RowProps {
  name: string;
  imageUrl?: string | null;
  badge?: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
  onClick: () => void;
}

const PickerRow = ({ name, imageUrl, badge, disabled, active, onClick }: RowProps) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 p-2 rounded-xl border text-left transition-colors cursor-pointer",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      active
        ? "border-primary/60 bg-primary/10"
        : "border-transparent hover:border-primary/40 hover:bg-background-muted"
    )}
  >
    <img
      src={imageUrl || DEFAULT_IMAGE_PATH}
      onError={(e) => {
        e.currentTarget.src = DEFAULT_IMAGE_PATH;
      }}
      alt={name}
      loading="lazy"
      className="w-10 h-14 object-cover rounded-lg shrink-0 bg-background-muted"
    />
    <span className="flex-1 min-w-0 font-semibold text-sm text-foreground line-clamp-2">
      {name}
    </span>
    {badge}
  </button>
);

const Hint = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center text-sm text-foreground-muted">
    {children}
  </div>
);

export const CharacterPickerPanel = ({
  onSelect,
  excludeIds = [],
  selectedId,
  isBusy = false,
  autoFocus = true,
  className,
}: CharacterPickerPanelProps) => {
  const [tab, setTab] = useState<PickerTab>("own");
  const [mode, setMode] = useState<"search" | "create">("search");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 350);

  const { mutate: resolve, isPending: isResolving, variables } = useResolveCharacter();
  const busy = isBusy || isResolving;

  const ownQuery = useMyCharacters({
    search: debouncedQuery || undefined,
    limit: 20,
    sortBy: "createdAt",
    order: "desc",
  });
  const apiQuery = useExternalCharacterSearch(debouncedQuery, 1, tab === "api");

  const ownCharacters = useMemo(
    () => ownQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [ownQuery.data]
  );
  const apiCharacters = apiQuery.data?.data ?? [];

  const excluded = useMemo(() => new Set(excludeIds), [excludeIds]);
  const ownByApiId = useMemo(() => {
    const map = new Map<number, Character>();
    ownCharacters.forEach((c) => c.apiId && map.set(c.apiId, c));
    return map;
  }, [ownCharacters]);

  const pick = (choice: CharacterChoice) => {
    if (busy) return;
    resolve(choice, {
      onSuccess: (character) => {
        if (excluded.has(character.id)) {
          notify.error(`${character.name} is already selected`);
          return;
        }
        onSelect(character);
      },
      onError: (error) => notify.error(getErrorMessage(error, "Could not save character")),
    });
  };

  const pendingKey =
    isResolving && variables
      ? variables.source === "api"
        ? `api-${variables.character.malId}`
        : variables.source === "own"
          ? `own-${variables.character.id}`
          : "custom"
      : null;

  if (mode === "create") {
    return (
      <div className={cn("p-3", className)}>
        <CustomCharacterForm
          initialName={query.trim()}
          isPending={isResolving}
          onBack={() => setMode("search")}
          onSubmit={(data: CreateCharacter) => pick({ source: "custom", character: data })}
        />
      </div>
    );
  }

  const isLoading =
    tab === "own"
      ? ownQuery.isFetching && !ownQuery.isFetchingNextPage
      : apiQuery.isFetching;

  const renderOwn = () => {
    if (ownQuery.isLoading) return <Hint>Loading...</Hint>;
    if (ownQuery.isError) return <Hint>Could not load your characters. Try again later.</Hint>;
    if (!ownCharacters.length) {
      return (
        <Hint>
          {debouncedQuery ? (
            <>
              <span>No characters named “{debouncedQuery}” in your list.</span>
              {debouncedQuery.length >= EXTERNAL_CHARACTER_MIN_QUERY && (
                <Button variant="accept" className="h-9 px-4 text-xs" onClick={() => setTab("api")}>
                  Search in API
                </Button>
              )}
            </>
          ) : (
            <span>You have no characters yet. Find one in the API or create a custom one.</span>
          )}
        </Hint>
      );
    }

    const rows = ownCharacters.map((c) => {
      const isExcluded = excluded.has(c.id);
      const isSelected = selectedId === c.id;
      return (
        <PickerRow
          key={c.id}
          name={c.name}
          imageUrl={c.imageUrl}
          active={isSelected}
          disabled={busy || isExcluded || isSelected}
          onClick={() => pick({ source: "own", character: c })}
          badge={
            pendingKey === `own-${c.id}` ? (
              <CircularProgress size={16} color="inherit" />
            ) : isSelected ? (
              <CheckIcon className="text-primary" fontSize="small" />
            ) : isExcluded ? (
              <span className="text-[10px] font-bold uppercase text-foreground-muted">Added</span>
            ) : !c.apiId ? (
              <span className="text-[10px] font-bold uppercase text-foreground-muted">Custom</span>
            ) : null
          }
        />
      );
    });

    return (
      <>
        {rows}
        <InfiniteScrollLoader
          hasNextPage={ownQuery.hasNextPage}
          isFetchingNextPage={ownQuery.isFetchingNextPage}
          fetchNextPage={ownQuery.fetchNextPage}
        />
      </>
    );
  };

  const renderApi = () => {
    if (debouncedQuery.length < EXTERNAL_CHARACTER_MIN_QUERY) {
      return <Hint>Type at least {EXTERNAL_CHARACTER_MIN_QUERY} letters to search Tenrai.</Hint>;
    }
    if (apiQuery.isLoading) return <Hint>Searching...</Hint>;
    if (apiQuery.isError) return <Hint>Search is unavailable right now. Try again later.</Hint>;
    if (!apiCharacters.length) return <Hint>Nothing found for “{debouncedQuery}”.</Hint>;

    return apiCharacters.map((c) => {
      const own = ownByApiId.get(c.malId);
      const isExcluded = own ? excluded.has(own.id) : false;
      const isSelected = own ? selectedId === own.id : false;
      return (
        <PickerRow
          key={c.malId}
          name={c.name}
          imageUrl={c.imageUrl}
          active={isSelected}
          disabled={busy || isExcluded || isSelected}
          onClick={() =>
            pick(own ? { source: "own", character: own } : { source: "api", character: c })
          }
          badge={
            pendingKey === `api-${c.malId}` ? (
              <CircularProgress size={16} color="inherit" />
            ) : isSelected ? (
              <CheckIcon className="text-primary" fontSize="small" />
            ) : own ? (
              <span className="text-[10px] font-bold uppercase text-foreground-muted">
                {isExcluded ? "Added" : "In your list"}
              </span>
            ) : null
          }
        />
      );
    });
  };

  return (
    <div className={cn("flex flex-col min-h-0", className)}>
      <div className="p-3 pb-2 space-y-2 shrink-0">
        <div className="relative flex items-center rounded-xl border-2 border-border focus-within:border-primary bg-background/50">
          <SearchIcon className="ml-3 text-foreground-muted shrink-0" fontSize="small" />
          <input
            type="search"
            value={query}
            autoFocus={autoFocus}
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tab === "api" ? "Search characters in Tenrai..." : "Search your characters..."}
            className="w-full bg-transparent border-none outline-none p-2.5 text-sm text-foreground placeholder:text-muted-foreground"
          />
          {isLoading && (
            <span className="mr-3 text-foreground-muted flex">
              <CircularProgress size={16} color="inherit" />
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-background-muted" role="tablist">
          {(
            [
              { value: "api", label: "API" },
              { value: "own", label: "Yours" },
            ] as const
          ).map((t) => (
            <button
              key={t.value}
              type="button"
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "h-8 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer",
                tab === t.value
                  ? "bg-card text-primary shadow-sm"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain px-3 space-y-1">
        {tab === "own" ? renderOwn() : renderApi()}
      </div>

      <div className="p-3 pt-2 border-t border-border shrink-0">
        <Button
          variant="text-only"
          disabled={busy}
          onClick={() => setMode("create")}
          className="w-full h-9 gap-1.5 justify-center text-sm font-bold hover:no-underline"
        >
          <AddIcon sx={{ fontSize: 18 }} />
          Create custom
        </Button>
      </div>
    </div>
  );
};
