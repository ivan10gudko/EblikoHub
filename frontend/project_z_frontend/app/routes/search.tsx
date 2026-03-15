import { queryClient } from "~/shared/lib/queryClient";
import { searchOptions } from "~/features/search/helpers/SearchOptions";
import SearchPage from "~/pages/search/SearchPage";
import type { Route } from "./+types/search";

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const page = Number(url.searchParams.get('page')) || 1;

    if (!query) return null;

    return await queryClient.ensureQueryData(searchOptions(query, page));
};

export default function SearchRoute() {
    return <SearchPage />;
}