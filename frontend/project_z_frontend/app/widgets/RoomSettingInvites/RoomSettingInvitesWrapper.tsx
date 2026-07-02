import type { ReactNode } from "react";
import { useParams } from "react-router";


interface RoomSettingInvitesWrapperProps {
  children: ReactNode;
}

export const RoomSettingInvitesWrapper = ({ children }: RoomSettingInvitesWrapperProps) => {
  const { id } = useParams<{ id: string }>(); // Дістаємо id кімнати з URL
  const roomId = Number(id);

  if (!roomId) return <div className="text-foreground/60 p-5">Invalid Room ID</div>;

  return (
    <div className="flex-1 bg-background-muted/10 border border-border/40 rounded-3xl p-6 backdrop-blur-md">
      {/* Тут відображатимуться вкладки FindUserTab, JoinRequestsTab або SentInvitesTab */}
      {children}
    </div>
  );
};