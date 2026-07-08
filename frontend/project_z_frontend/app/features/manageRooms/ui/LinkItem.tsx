import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TitleTypeThemes, type TitleShort } from "~/entities/titleRecord";
import { Button } from "~/shared/ui/Button";

interface LinkItemProps {
    title: TitleShort;
    onDelete: () => void;
}

const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";

export const LinkItem = ({ title, onDelete }: LinkItemProps) => {
    const themeClasses = title.type ? TitleTypeThemes[title.type] : "";

    return (
        <div
            className={`flex items-center gap-4 p-2 rounded-xl border bg-card transition-colors hover:bg-border/30 ${themeClasses}`}
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
                className=" border  border-danger/40 text-white/70 hover:bg-danger/20 hover:text-danger gap-2 px-4 py-2 rounded-xl bg-danger/40"
            >
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </Button>
        </div>
    );
};
