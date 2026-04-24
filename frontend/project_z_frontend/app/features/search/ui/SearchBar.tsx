import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    minLength?: number;
    className?: string;
    initialValue?: string;
}
interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading?: boolean; 
    placeholder?: string;
    minLength?: number;
    className?: string;
    initialValue?: string;
    clearOnSubmit?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    isLoading = false, 
    placeholder = "Search...",
    minLength = 2,
    className = "",
    initialValue = "",
    clearOnSubmit = true
}) => {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedValue = value.trim();

        if (trimmedValue && trimmedValue.length >= minLength) {
            setError(null);
            onSearch(trimmedValue);
        } else {
            setError(`Length should be at least ${minLength}`);
        }
        if(clearOnSubmit) setValue("")
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (error) setError(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`relative border-foreground-muted border w-full max-w-md flex-1 rounded-lg flex items-center min-w-[100px] ${className}`}
        >
            <input
                name="Search Input"
                type="search"
                placeholder={placeholder}
                className="border-none outline-none p-2 rounded-l-lg w-full bg-transparent"
                value={value}
                onChange={handleChange}
                disabled={isLoading} 
            />
            
            {error && (
                <span className="text-danger text-xs bg-background px-2 py-1 rounded border border-danger absolute left-0 -bottom-8 z-10 shadow-sm">
                    {error}
                </span>
            )}
            
            <button
                type="submit"
                className="px-3 py-2 hover:bg-background-muted transition-colors rounded-r-lg flex items-center justify-center min-w-[48px]"
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