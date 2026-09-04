import { Outlet } from "react-router";
import { WatchListPage } from "~/pages/watchList/WatchListPage";
import type { Route } from "./+types/index.$userId";

export async function loader({ params }: Route.LoaderArgs) {
  return { userId: params.userId };
}

export default function WatchListIndexRoute({ params }: Route.ComponentProps) {
  const { userId } = params;

  return <>
    <WatchListPage userId={userId} />;
    <Outlet />
  </>
}