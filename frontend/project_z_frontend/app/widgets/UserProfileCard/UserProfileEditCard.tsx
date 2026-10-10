import { useState, useRef } from "react";
import { Button } from "~/shared/ui/Button";
import { UserAvatar } from "~/entities/user";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { getCroppedImg } from "~/shared/helpers";
import { ImageCropper } from "~/shared/ui/ImageCropper/ImageCropper";
import { UserFavoriteTitlesShowcase } from "./UserFavoriteTitlesShowcase";
import type { UserProfileWithFavorite } from "~/features/profile";
import { SelectFavoriteModal } from "~/features/manageFavoriteTitles";

interface UserProfileEditProps {
  user: UserProfileWithFavorite;
  onSave: (
    data: { name: string; description: string },
    file: File | null,
  ) => void;
  onCancel: () => void;
  isPending: boolean;
}

export const UserProfileEdit = ({
  user,
  onSave,
  onCancel,
  isPending,
}: UserProfileEditProps) => {
  const [formData, setFormData] = useState({
    name: user.name,
    description: user.description || "",
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [finalPreview, setFinalPreview] = useState(user.img);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
      {imageSrc ? (
        <ImageCropper
          imageSrc={imageSrc}
          onCancel={() => setImageSrc(null)}
          onConfirm={async (pixels) => {
            const blob = await getCroppedImg(imageSrc, pixels);
            const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            setFinalPreview(URL.createObjectURL(blob));
            setImageSrc(null);
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div
            className="relative cursor-pointer group w-32 h-32"
            onClick={() => fileInputRef.current?.click()}
          >
            <UserAvatar src={finalPreview ?? undefined} name={formData.name} size="lg" />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <PhotoCameraIcon className="text-white scale-125" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelected}
            className="hidden"
            accept="image/*"
          />
        </div>
      )}

      <div className="flex flex-col gap-4">
        <input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="p-3 rounded-xl border-2 border-border outline-none focus:border-primary"
        />
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="min-h-[120px] p-3 rounded-xl border-2 border-border outline-none resize-none"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div className="h-[1px] bg-background-muted w-full my-2" />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-muted-foreground">
          Favorite Titles
        </span>
        <UserFavoriteTitlesShowcase
          profile={user}
          isOwner={true}
          onAddClick={(position) => setSelectedPosition(position)}
        />
      </div>

      {selectedPosition !== null && (
        <SelectFavoriteModal
          position={selectedPosition}
          userId={user.userId}
          favoriteTitles={user.favoriteTitles}
          isOpen={selectedPosition !== null}
          onClose={() => setSelectedPosition(null)}
        />
      )}

      <div className="flex gap-3 mt-2">
        <Button
          onClick={() => onSave(formData, selectedFile)}
          disabled={isPending || !!imageSrc}
          className="flex-1"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
        <Button variant="destructive" onClick={onCancel} className="px-6 py-3">
          Cancel
        </Button>
      </div>
    </div>
  );
};