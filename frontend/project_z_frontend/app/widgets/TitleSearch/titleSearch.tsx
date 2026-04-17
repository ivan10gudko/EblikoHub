import { useState } from 'react';
import { SearchBar } from "~/features/search";
import { searchOptions } from "~/features/search";
import { useQuery } from '@tanstack/react-query';
import { AnimeSearchResults } from '~/entities/titleRecord/ui/searchDropDownResult';
import type { AnimeCardType } from '~/entities/title';

export const TitleSearch = ({ onSelect }: { onSelect: (anime: AnimeCardType) => void }) => {
    const [localQuery, setLocalQuery] = useState("");
    const { data } = useQuery({
        ...searchOptions(localQuery, 1),
        enabled: localQuery.length >= 3
    });
    const onClose = () => {
        setLocalQuery("")
    }

    const results = data?.data || [];

    return (
        <div className="relative w-full">
            <SearchBar
                onSearch={(val) => setLocalQuery(val)}
                placeholder="Search anime to add..."
                className="!max-w-full border-2 border-slate-200 focus-within:border-amber-400 rounded-xl"
            />

            {localQuery && (
                <AnimeSearchResults
                    results={results}
                    onSelect={onSelect}
                    onClose={onClose}
                />
            )}
        </div>
    );
};