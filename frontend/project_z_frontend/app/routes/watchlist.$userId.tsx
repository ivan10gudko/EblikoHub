import type { Route } from "./+types/watchlist.$userId";
import { WatchListPage } from "~/pages/watchList";

export async function loader({ params }: Route.LoaderArgs) {
  return { userId: params.userId };
}

export default function WatchListRoute({ params }: Route.ComponentProps) {
  const { userId } = params;

  return <WatchListPage userId={userId} />;
}
