import { redirect, useParams } from "react-router";
import { RoomsPage } from "~/pages/room";

export default function RoomsRoute() {
    const {userId} = useParams<{ userId: string }>();

    if (!userId) return redirect("/auth/login");
    
    return <RoomsPage userId = {userId}/>;
}