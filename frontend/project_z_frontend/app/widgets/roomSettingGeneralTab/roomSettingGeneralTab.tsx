import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { useRoomMutation, type Room, type UpdateRoomPayload } from "~/entities/room";
import { Button } from "~/shared/ui/Button";
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";

interface RoomSettingGeneralTabProps {
  room: Room;
}
export const RoomSettingGeneralTab: React.FC<RoomSettingGeneralTabProps> = ({
  room,
}) => {
  const { updateRoom, isUpdating } = useRoomMutation();

  const [formData, setFormData] = useState<UpdateRoomPayload>({
    roomName: room?.roomName || "",
    imageUrl: room?.imageUrl || "",
    description: room?.description || "",
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomName: room.roomName || "",
        imageUrl: room.imageUrl || "",
        description: room.description || "",
      });
    }
  }, [room]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, imageUrl: url || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (room?.roomId) {
      updateRoom(room.roomId, formData);
    }
  };

  return (
    <div className="w-full max-w-3xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden text-left transition-all">
      <div className="p-6 bg-card border-b border-border flex items-center gap-3">
        <SettingsIcon sx={{ color: "#ffa31a", fontSize: 22 }} />
        <div>
          <div className="text-primary font-semibold text-xs uppercase tracking-wider">
            Room Management
          </div>
          <h3 className="text-base font-bold text-foreground mt-0.5 tracking-wide">
            {formData.roomName || "Unnamed Space"}
          </h3>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs font-semibold text-foreground-muted tracking-wide px-1">
              Space Cover
            </span>
            <ImageUrlEditor
              imageUrl={formData.imageUrl || null}
              onImageChange={handleImageChange}
              variant="landscape"
              defaultImage="/defaultTitleRecordImage.jpg"
            />
          </div>

          <div className="flex flex-col gap-5 w-full">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-muted tracking-wide">
                Room Name
              </label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
                placeholder="Enter room name..."
                className="w-full h-12 bg-card border border-border rounded-xl px-4 text-sm text-foreground placeholder-foreground-muted/40 focus:outline-none focus:border-primary transition-all font-medium"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground-muted tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what this space is about..."
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground-muted/40 focus:outline-none focus:border-primary transition-all resize-none leading-relaxed font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2 pt-4 border-t border-border">
          <Button
            type="submit"
            variant="save"
            disabled={isUpdating}
            className="h-10 sm:h-12"
          >
            {isUpdating ? "Saving changes..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};