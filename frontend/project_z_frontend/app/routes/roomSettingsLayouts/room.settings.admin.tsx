import React from 'react';
import { useLocation, useParams } from 'react-router';
import { RoomBansTab } from '~/widgets/AdministrationTab/RoomBansTab';

export const RoomSettingsAdmin: React.FC = () => {
  const params = useParams<Record<string, string>>();
  const location = useLocation();

  let roomId = params.roomId || params.id;

  if (!roomId) {
    const match = location.pathname.match(/\/rooms\/(\d+)/);
    if (match) {
      roomId = match[1];
    }
  }

  if (!roomId) {
    return (
      <div className="p-4 bg-danger/10 border border-danger/20 text-danger text-sm font-medium rounded-xl backdrop-blur-md">
        Routing Error: Room ID could not be resolved from the URL path.
      </div>
    );
  }

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/5">
      <RoomBansTab roomId={roomId} />
    </div>
  );
};

export default RoomSettingsAdmin;