import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebouncedCallback } from "~/shared/hooks/useDebouncedCallback";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onChange?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
  placeholder?: string;
  minLength?: number;
  className?: string;
  initialValue?: string;
  clearOnSubmit?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onChange,
  debounceMs,
  isLoading = false,
  placeholder = "Search...",
  minLength = 2,
  className = "",
  initialValue = "",
  clearOnSubmit = false,
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const triggerSearch = (query: string) => {
    const trimmed = query.trim();

    if (trimmed.length === 0) {
      setError(null);
      onSearchRef.current("");
      return true;
    }

    if (trimmed.length < minLength) {
      setError(`Length should be at least ${minLength}`);
      return false;
    }

    setError(null);
    onSearchRef.current(trimmed);
    return true;
  };

  const [debouncedSearch, cancelDebounce] = useDebouncedCallback(
    (val: string) => triggerSearch(val),
    debounceMs ?? 0,
  );

  useEffect(() => {
    if (debounceMs === undefined) return;
    debouncedSearch(value);
  }, [value, debounceMs, debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    cancelDebounce();

    const isSearchValid = triggerSearch(value);

    if (isSearchValid && clearOnSubmit) {
      setValue("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (onChange) onChange(newValue);
    if (error) setError(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative border-foreground-muted border w-full max-w-md flex-1 rounded-lg flex items-center min-w-[100px] ${className}`}
    >
      <input
        type="search"
        placeholder={placeholder}
        className="border-none outline-none p-2 rounded-l-lg w-full bg-transparent placeholder:text-muted-foreground text-foreground focus:outline-none"
        value={value}
        onChange={handleChange}
        autoComplete="off"
      />

      {error && (
        <span className="text-danger text-xs bg-background px-2 py-1 rounded border border-danger absolute left-0 -bottom-8 z-10 shadow-sm">
          {error}
        </span>
      )}

      <button
        type="submit"
        className="px-3 py-2 hover:bg-background-muted transition-colors rounded-r-lg flex items-center justify-center min-w-[48px] text-foreground"
        aria-label="Search"
        disabled={isLoading}
      >
        {isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <SearchIcon />
        )}
      </button>
    </form>
  );
};

export default SearchBar;
