
import { useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { RoomDetailsSettingsTitlesLinks } from "~/widgets/RoomDetailsSettingsTitles";

export default function RoomSettingsTitlesPage() {
  const { id: roomId } = useParams<{ id: string }>();

  const { userId } = useAuthStore();

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Manage Room Titles Links</h1>
      
      <RoomDetailsSettingsTitlesLinks
        userId={userId!} 
        roomId={Number(roomId)} 
      />
    </div>
  );
}