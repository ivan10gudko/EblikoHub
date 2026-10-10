
import { useParams } from "react-router";
import { useAuthStore } from "~/features/auth";
import { RoomDetailsSettingsTitlesLinks } from "~/widgets/RoomDetailsSettingsTitles";

export default function RoomSettingsTitlesPage() {
  const { id: roomId } = useParams<{ id: string }>();

  const { userId } = useAuthStore();

  return (
    <div className="p-1 w-full">
      
      
      <RoomDetailsSettingsTitlesLinks
        userId={userId!} 
        roomId={Number(roomId)} 
      />
    </div>
  );
}