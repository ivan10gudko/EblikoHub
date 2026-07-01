import React, { useState, useEffect } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import type { Room, UpdateRoomPayload } from "~/entities/room"; 
import { Button } from "~/shared/ui/Button"; 
import { ImageUrlEditor } from "~/shared/ui/ImageUrlEditor";

interface RoomSettingGeneralTabProps {
  room: Room;
  onSave?: (data: UpdateRoomPayload) => Promise<void> | void;
  isLoading?: boolean;
}

export const RoomSettingGeneralTab: React.FC<RoomSettingGeneralTabProps> = ({
  room,
  onSave,
  isLoading = false,
}) => {
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

  // Колбек для оновлення посилання на картинку з редактора
  const handleImageChange = (url: string | null) => {
    setFormData((prev) => ({ ...prev, imageUrl: url || "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) onSave(formData);
  };

  return (
    <div className="w-full max-w-3xl bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden text-left transition-all">
      
      {/* Шапка */}
      <div className="p-6 bg-[var(--card)] border-b border-[var(--border)] flex items-center gap-3">
        <SettingsIcon sx={{ color: "var(--primary)", fontSize: 22 }} />
        <div>
          <div className="text-[var(--primary)] font-semibold text-xs uppercase tracking-wider">
            Room Management
          </div>
          <h3 className="text-base font-bold text-[var(--foreground)] mt-0.5 tracking-wide">
            {formData.roomName || "Unnamed Space"}
          </h3>
        </div>
      </div>

      {/* Форма на дві колонки */}
      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Ліва колонка: Інтегрований редактор зображення */}
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide px-1">
              Space Cover
            </span>
            <ImageUrlEditor
              imageUrl={formData.imageUrl || null}
              onImageChange={handleImageChange}
              variant="landscape"
              defaultImage="/defaultTitleRecordImage.jpg" // Твій дефолтний шлях
            />
          </div>

          {/* Права колонка: Текстові інпути */}
          <div className="flex flex-col gap-5 w-full">
            {/* Поле: Назва кімнати */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide">
                Room Name
              </label>
              <input
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
                placeholder="Enter room name..."
                className="w-full h-12 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)]/40 focus:outline-none focus:border-[var(--primary)] transition-all font-medium"
              />
            </div>

            {/* Поле: Опис кімнати */}
            <div className="flex flex-col gap-1.5 custom-scrollbar">
              <label className="text-xs font-semibold text-[var(--foreground-muted)] tracking-wide">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe what this space is about..."
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--foreground-muted)]/40 focus:outline-none focus:border-[var(--primary)] transition-all resize-none leading-relaxed font-medium"
              />
            </div>
          </div>

        </div>

        {/* Нижня панель із кнопкою збереження */}
        <div className="flex justify-end mt-2 pt-4 border-t border-[var(--border)]">
          <Button 
            type="submit" 
            variant="fill" 
            disabled={isLoading} 
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--background)] font-bold px-8 h-11 rounded-xl text-sm transition-all shadow-lg active:scale-[0.98]"
          >
            {isLoading ? "Saving changes..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};