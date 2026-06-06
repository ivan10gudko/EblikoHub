import { useState, useEffect } from "react";
import type { UserProfile } from "../model/user.types";
import { userService } from "../api/UserService";

export const useUserSearch = (query: string, page = 0, size = 10) => {
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [paginationInfo, setPaginationInfo] = useState({
        totalPages: 0,
        totalElements: 0,
        isLast: true
    });

    useEffect(() => {
        setSearchResults([]);
        setPaginationInfo({ totalPages: 0, totalElements: 0, isLast: true });
    }, [query]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 1) {
            setSearchResults([]);
            setIsLoading(false);
            return;
        }

        const delayDebounceMatrix = setTimeout(async () => {
            setIsLoading(true);
            setError(null);

            try {
                if (trimmedQuery.startsWith("@")) {
                    const cleanTag = trimmedQuery.substring(1);

                    if (cleanTag.length === 0) {
                        setSearchResults([]);
                        setIsLoading(false);
                        return;
                    }

                    const data = await userService.searchByNameTag(cleanTag);
                    setSearchResults(data ? [data] : []);
                    setPaginationInfo({ totalPages: 1, totalElements: data ? 1 : 0, isLast: true });
                } else {
  
                    const response = await userService.searchByName(trimmedQuery, { page, limit: size });

                    setSearchResults(prev =>
                        page === 0 ? (response.content || []) : [...prev, ...(response.content || [])]
                    );

                    setPaginationInfo({
                        totalPages: response.totalPages,
                        totalElements: response.totalElements,
                        isLast: response.last
                    });
                }
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setSearchResults([]);
                } else {
                    setError("Something went wrong while searching...");
                }
            } finally {
                setIsLoading(false);
            }
        }, 400); 

        return () => clearTimeout(delayDebounceMatrix);
    }, [query, page, size]);

    return { searchResults, isLoading, error, paginationInfo };
};