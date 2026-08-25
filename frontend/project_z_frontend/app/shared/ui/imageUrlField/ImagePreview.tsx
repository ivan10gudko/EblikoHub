import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Button } from "~/shared/ui/Button";
import { useImageEditorContext } from "./ImageEditorContext";
import { cn } from "~/shared/lib";

type ImagePreviewProps = {
  className?: string;
  containerClassName?: string;
  width?: number | string;
  height?: number | string;
};

export const ImagePreview = ({
  className,
  containerClassName,
  width,
  height,
}: ImagePreviewProps) => {
  const {
    imageUrl,
    imageError,
    defaultImage,
    variant,
    handleClearImage,
    handleImageError,
  } = useImageEditorContext();

  
  const defaultSize =
    variant === "portrait"
      ? { width: 160, height: 224 }
      : { width: "100%", height: "auto" };

  const containerStyle = {
    width: width ?? (containerClassName ? undefined : defaultSize.width),
    height: height ?? (containerClassName ? undefined : defaultSize.height),
  };

  return (
    <div className="relative group shrink-0">
      <div
        style={containerStyle}
        className={cn(
          "bg-card/50 backdrop-blur-sm rounded-xl border border-border/40 flex items-center justify-center overflow-hidden shadow-md transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/10",
          variant === "landscape" && "max-w-[400px] aspect-video",
          containerClassName,
        )}
      >
        <img
          src={imageError || !imageUrl ? defaultImage : imageUrl}
          alt="Title Preview"
          onError={handleImageError}
          className={cn(
            "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
            (!imageUrl || imageError) && "opacity-20 grayscale",
            className,
          )}
        />

        {imageUrl && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full border-danger bg-background p-0 text-danger transition-transform hover:bg-danger hover:text-white active:scale-90"
              onClick={handleClearImage}
            >
              <DeleteForeverIcon sx={{ fontSize: 24 }} />
            </Button>
          </div>
        )}
      </div>

      <div className="absolute inset-x-4 -bottom-2 -z-10 h-4 bg-primary/20 blur-xl opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );
};
