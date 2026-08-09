import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TitleTypeThemes, TitleType, type TitleShort, type TitleVisual, getTitleThemeClassname } from "~/entities/titleRecord";
import { Button } from "~/shared/ui/Button";

interface LinkItemProps {
  title: TitleVisual;
  onDelete: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";



export const LinkItem = ({ title, onDelete }: LinkItemProps) => {
 
  const themeClasses = getTitleThemeClassname(title.titleType);
  const borderClass = themeClasses ? "" : "border-border/50";

  return (
    <div
      className={`flex items-center gap-4 p-2 rounded-xl border ${borderClass} transition-colors hover:bg-border/30 ${themeClasses}`}
    >
      <div className="relative h-10 w-16 shrink-0 rounded-md overflow-hidden bg-border">
        <img
          src={title.imageUrl || DEFAULT_IMAGE_PATH}
          alt={title.titleName}
          className="w-full h-full object-cover"
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