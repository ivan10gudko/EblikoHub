import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TitleTypeThemes, TitleType, type TitleShort, type TitleVisual, getTitleThemeClassname } from "~/entities/titleRecord";
import { Button } from "~/shared/ui/Button";
import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import { TitleHoverPreview } from "~/shared/ui/HoverPreviewImage";

interface LinkItemProps {
  title: TitleVisual;
  onDelete: () => void;
}



export const LinkItem = ({ title, onDelete }: LinkItemProps) => {

  const themeClasses = getTitleThemeClassname(title.titleType);
  const borderClass = themeClasses ? "" : "border-border/50";

  return (
    <div
      className={`flex items-center gap-4 p-2 rounded-xl border ${borderClass} transition-colors hover:bg-border/30 ${themeClasses}`}
    >
      <div className="relative h-10 w-16 shrink-0 rounded-md overflow-hidden bg-border">
        <TitleHoverPreview
          imageUrl={title.imageUrl}
          titleName={title.titleName}
          className="h-10 w-16 flex-shrink-0 rounded-md overflow-hidden"
          previewClassName="w-40 h-56"
        />
      </div>

      <span className="font-bold flex-1 truncate text-xs sm:text-sm uppercase">
        {title.titleName}
      </span>

      <Button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        variant="altCancel"
      >
        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
      </Button>
    </div>
  );
};