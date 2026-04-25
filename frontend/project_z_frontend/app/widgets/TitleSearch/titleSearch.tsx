import { useState } from "react";
import { SearchBar } from "~/features/search";
import { searchOptions } from "~/features/search";
import { useQuery } from "@tanstack/react-query";
import { AnimeSearchResults } from "~/entities/titleRecord/ui/searchDropDownResult";
import type { AnimeCardType } from "~/entities/title";

export const TitleSearch = ({
  onSelect,
}: {
  onSelect: (anime: AnimeCardType) => void;
}) => {
  const [localQuery, setLocalQuery] = useState("");
  const { data, isFetching } = useQuery({
    ...searchOptions(localQuery, 1),
    enabled: localQuery.length >= 3,
  });
  const onClose = () => {
    setLocalQuery("");
  };

  const results = data?.data || [];

  return (
    <div className="relative w-full">
      <SearchBar
        clearOnSubmit={true}
        isLoading={isFetching}
        onSearch={(val) => setLocalQuery(val)}
        placeholder="Search anime to add..."
        className="!max-w-full border-2 border-border focus-within:border-primary-hover rounded-xl px-2"
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
