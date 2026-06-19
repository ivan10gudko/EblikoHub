import { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";

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
  clearOnSubmit = true,
}) => {
  const [value, setValue] = useState<string>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (debounceMs === undefined) return;

    const trimmedValue = value.trim();

    const handler = setTimeout(() => {
      if (trimmedValue.length >= minLength) {
        setError(null);
        onSearchRef.current(trimmedValue);
      } else if (trimmedValue.length > 0) {
        setError(`Length should be at least ${minLength}`);
      } else {
        setError(null);
        onSearchRef.current("");
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, minLength]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = value.trim();

    if (trimmedValue && trimmedValue.length >= minLength) {
      setError(null);
      onSearchRef.current(trimmedValue);
    } else {
      setError(`Length should be at least ${minLength}`);
    }
    if (clearOnSubmit) setValue("");
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
      translate="no"
      className={`notranslate relative border-foreground-muted border w-full max-w-md flex-1 rounded-lg flex items-center min-w-[100px] ${className}`}
    >
      <input
        ref={inputRef}
        name="Search Input"
        type="search"
        placeholder={placeholder}
        translate="no"
        className="notranslate border-none outline-none p-2 rounded-l-lg w-full bg-transparent placeholder:text-muted-foreground placeholder:opacity-100 text-foreground focus:outline-none"
        value={value}
        onChange={handleChange}
        disabled={false}
        autoComplete="off"
      />

      {error && (
        <span
          translate="no"
          className="notranslate text-danger text-xs bg-background px-2 py-1 rounded border border-danger absolute left-0 -bottom-8 z-10 shadow-sm"
          dangerouslySetInnerHTML={{ __html: error }}
        />
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