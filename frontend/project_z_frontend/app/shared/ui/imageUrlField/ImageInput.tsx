import LinkIcon from "@mui/icons-material/Link";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Input } from "~/shared/ui/Input";
import { Button } from "~/shared/ui/Button";
import { useImageEditorContext } from "./ImageEditorContext";
import { cn } from "~/shared/lib/utils";

export const ImageUrlInput = ({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) => {
  const { tempUrl, imageError, handleUrlChange, handleClearImage } =
    useImageEditorContext();

  return (
    <div className={cn(`w-full space-y-3 ${className}`)}>
      {showLabel && (
        <>
          <div className="flex items-center justify-between px-1">
            <label className="text-xs tracking-[0.2em] text-foreground flex items-center gap-2">
              <LinkIcon sx={{ fontSize: 14 }} className="text-primary" />
              Source URL
            </label>
          </div>

          {tempUrl && (
            <span
              className={`text-[10px] font-bold uppercase ${imageError ? "text-danger" : "text-primary/60"}`}
            >
              {imageError ? "Invalid Link" : "Link Detected"}
            </span>
          )}
        </>
      )}

      <div className="relative group/input">
        <Input
          type="text"
          autoComplete="off"
          placeholder="Enter poster url..."
          value={tempUrl}
          onChange={handleUrlChange}
          className={`h-12 w-full pl-4 pr-12 border-2 rounded-xl font-medium bg-background/50 transition-all shadow-inner placeholder:opacity-10 ${
            imageError && tempUrl
              ? "border-danger/50 focus:border-danger"
              : "border-border/50 focus:border-primary focus:bg-background"
          }`}
        />

        {tempUrl && (
          <Button
            onClick={handleClearImage}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground hover:text-danger transition-all hover:scale-110"
          >
            <DeleteForeverIcon sx={{ fontSize: 22 }} />
          </Button>
        )}
      </div>

      {imageError && tempUrl && (
        <div className="flex items-center gap-2 px-1 animate-in fade-in slide-in-from-top-1">
          <span className="h-1 w-1 rounded-full bg-danger" />
          <p className="text-danger text-[11px] font-bold">
            Could not load image. Please check the URL.
          </p>
        </div>
      )}
    </div>
  );
};
