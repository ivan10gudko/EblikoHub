
import { useSearchParams, useNavigate } from "react-router";
import { useQuery } from '@tanstack/react-query';
import { SearchBar, searchOptions } from "~/features/search";
import { AnimeCard } from "~/entities/title";
import { Pagination } from "~/shared/ui/Pagination";
import AnimeSkeletonCard from "~/entities/title/ui/AnimeCardSkeleton";


const SearchPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const queryStr = searchParams.get('query') || '';
    const pageStr = searchParams.get('page') || '1';
    const currentPage = Number(pageStr);

    const { data: apiResponse, isLoading, isError } = useQuery(searchOptions(queryStr, currentPage));

    const handleMainSearch = (newQuery: string) => {
        if (newQuery === queryStr) return;
        navigate(`/search?query=${encodeURIComponent(newQuery)}&page=1`);
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ query: queryStr, page: newPage.toString() });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const animeList = apiResponse?.data || [];
    const pagination = apiResponse?.pagination;
    const hasResults = animeList.length > 0;

    return (
        <div className="w-full my-10 px-2 md:px-8 lg:px-20">
            <h1 className="text-xl font-bold px-2 mb-4">
                {queryStr
                    ? `Search results for query: "${queryStr}"`
                    : "Search Anime"}
            </h1>

            <div className="py-8 border-b flex justify-between items-center px-2 mb-6">
                <SearchBar
                    key={queryStr}
                    onSearch={handleMainSearch}
                    className="w-full md:w-96"
                    initialValue={queryStr}
                />
            </div>

            {isLoading && (
                <div className="card-container">
                    {[0, 1, 2, 3, 4].map((v) => <AnimeSkeletonCard key={v} />)}
                </div>
            )}

            {isError && !isLoading && (
                <div className="text-red-500 text-center py-10">
                    <h2 className="text-xl">Something went wrong. Please try again later.</h2>
                </div>
            )}

            {!isLoading && !isError && !hasResults && queryStr && (
                <h2 className="text-xl px-2 text-gray-500">
                    There are no results for query "{queryStr}"
                </h2>
            )}

            {!isLoading && hasResults && (
                <>
                    <div className="card-container">
                        {animeList.map((anime) => (
                            <AnimeCard key={anime.id} data={anime} />
                        ))}
                    </div>

                    {pagination && pagination.last_visible_page > 1 && (
                        <Pagination
                            currentPage={pagination.current_page}
                            totalPages={pagination.last_visible_page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default SearchPage;