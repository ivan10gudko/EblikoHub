import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "~/shared/ui/Button";
import { Input } from "~/shared/ui/Input";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { CreateCharacter } from "~/entities/character";

interface CustomCharacterFormProps {
  initialName?: string;
  isPending?: boolean;
  onBack: () => void;
  onSubmit: (data: CreateCharacter) => void;
}

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const CustomCharacterForm = ({
  initialName = "",
  isPending,
  onBack,
  onSubmit,
}: CustomCharacterFormProps) => {
  const [name, setName] = useState(initialName);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  const trimmedUrl = imageUrl.trim();
  const urlError = trimmedUrl && !isValidUrl(trimmedUrl) ? "Invalid URL" : null;
  const canSubmit = name.trim().length > 0 && !urlError && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ name: name.trim(), imageUrl: trimmedUrl || null, apiId: null });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="close"
          onClick={onBack}
          aria-label="Back to search"
          className="shrink-0"
        >
          <ArrowBackIcon sx={{ fontSize: 18 }} />
        </Button>
        <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Create custom character
        </span>
      </div>

      <div className="flex gap-4 items-start">
        <img
          src={trimmedUrl && !urlError && !imageError ? trimmedUrl : DEFAULT_IMAGE_PATH}
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
          alt={name || "Character preview"}
          className="w-16 h-22 object-cover rounded-lg border border-border/40 shrink-0 bg-background-muted"
        />
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <Input
            name="Name"
            value={name}
            onChange={setName}
            autoFocus
            maxLength={255}
          >
            Character name
          </Input>
          <Input
            name="Image URL"
            value={imageUrl}
            onChange={(v) => {
              setImageUrl(v);
              setImageError(false);
            }}
            error={urlError}
          >
            Image URL (optional)
          </Input>
          {trimmedUrl && !urlError && imageError && (
            <p className="text-danger text-[11px] font-bold px-1">
              Could not load image. Please check the URL.
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={!canSubmit} className="w-full h-10 rounded-xl font-bold">
        {isPending ? "Creating..." : "Create and select"}
      </Button>
    </form>
  );
};
