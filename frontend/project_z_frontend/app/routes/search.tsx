
import { queryClient } from "~/shared/lib";
import type { Route } from "./+types/search";
import { searchOptions } from "~/features/search";
import { SearchPage } from "~/pages/search";

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