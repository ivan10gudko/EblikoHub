import { useParams } from "react-router";
import { RoomTitlesManager } from "~/widgets/RoomDetailsSettingsTitles/RoomTitlesManager";

export default function RoomSettingsTitlesPage() {
  const params = useParams<{ id: string }>();
  const roomId = params.id ? parseInt(params.id, 10) : NaN;

  if (isNaN(roomId)) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <h2 className="text-xl font-semibold">Room ID not found</h2>
        <p>Unable to retrieve the room ID from the URL.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Titles</h1>
        <p className="text-muted-foreground">
          Here you can add and remove titles for this room.
        </p>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <RoomTitlesManager roomId={roomId} />
      </div>
    </div>
  );
}
