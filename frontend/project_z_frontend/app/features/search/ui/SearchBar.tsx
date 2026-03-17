import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import clsx from "clsx"; // Опціонально: корисно для об'єднання класів, або використовуйте template strings

interface SearchBarProps {
    onSearch: (query: string) => void; // Головний колбек
    placeholder?: string;
    minLength?: number;
    className?: string;
    initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Search...",
    minLength = 3,
    className = "",
    initialValue = ""
}) => {
    const [value, setValue] = useState<string>(initialValue);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedValue = value.trim();

        if (trimmedValue && trimmedValue.length >= minLength) {
            setError(null);
            onSearch(trimmedValue);
            
            setValue("");
        } else {
            setError(`Length should be at least ${minLength}`);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (error) setError(null);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`relative border-black/60 border rounded-lg flex items-center ${className}`}
        >
            <input
                name="Search Input"
                type="search"
                placeholder={placeholder}
                className="border-none outline-none p-2 rounded-l-lg w-full bg-transparent"
                value={value}
                onChange={handleChange}
            />
            
            {error && (
                <span className="text-red-700 text-xs bg-white px-2 py-1 rounded border border-red-700 absolute left-0 -bottom-8 z-10 shadow-sm">
                    {error}
                </span>
            )}
            
            <button
                type="submit"
                className="px-3 py-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                aria-label="Search"
            >
                <SearchIcon />
            </button>
        </form>
    );
};

export default SearchBar;
