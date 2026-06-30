import { queryClient } from "~/shared/lib/queryClient";
import type { Route } from "./+types/anime.$id";
import { getAnimeById } from "~/entities/title";
import { AnimePage, AnimePageSkeleton } from "~/pages/animePage";

export async function clientLoader({ params }: Route.LoaderArgs) {
  if (!params.id) {
    throw new Response("Anime ID is required", { status: 400 });
  }

  const id = Number(params.id);

  await queryClient.ensureQueryData({
    queryKey: ["anime", params.id],
    queryFn: () => getAnimeById(id),
  });

  return { id };
}

export function HydrateFallback() {
  return <AnimePageSkeleton />;
}

export default function AnimeRoute({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return <AnimePageSkeleton />;

  return <AnimePage id={loaderData.id} />;
}
