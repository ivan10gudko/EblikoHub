import { getAnimeById } from "~/features/anime/services/jikan.api";
import { queryClient } from "~/shared/lib/queryClient";
import AnimePage from "~/pages/animePage/AnimePage";
import AnimePageSceleton from "~/features/anime/components/AnimePageSceleton";
import type { Route } from "./+types/anime.$id";

export async function clientLoader({ params }: Route.LoaderArgs) {
    if (!params.id) {
        throw new Response("Anime ID is required", { status: 400 });
    }

    const id = Number(params.id)

    await queryClient.ensureQueryData({
        queryKey: ["anime", params.id],
        queryFn: () => getAnimeById(id)
    });

    return { id };
}

export function HydrateFallback() {
    return <AnimePageSceleton />;
}

export default function AnimeRoute({ loaderData }: Route.ComponentProps) {
    if (!loaderData) return <AnimePageSceleton />;

    return <AnimePage id={loaderData.id} />;
}

