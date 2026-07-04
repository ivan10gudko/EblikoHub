
import { TitleTypeThemes } from "~/entities/titleRecord";
import type { RoomTitleWithUserLinks } from "~/features/manageRooms";

interface RoomTitleRowProps {
    title: RoomTitleWithUserLinks;
}

export const RoomTitleReadOnlyRowShort = ({ title }: RoomTitleRowProps) => {
    const DEFAULT_IMAGE_PATH = "/defaultTitleRecordImage.jpg";
    const themeClasses = title.titleType ? TitleTypeThemes[title.titleType] : "";
    return (
        <div className={`group/row flex items-center gap-4 bg-card p-2 rounded-xl border border-border/50 transition-all duration-300 w-full min-w-0 ${themeClasses}`}>
            <div className="w-[20px]" /> 

            <div className="relative h-10 w-16 flex-shrink-0">
                <img
                    src={title.imageUrl || DEFAULT_IMAGE_PATH}
                    className="h-full w-full object-cover rounded-md"
                    alt={title.titleName}
                />
            </div>

            <div className="flex-1 min-w-0">
                <span className="block truncate font-bold text-foreground uppercase text-xs sm:text-sm">
                    {title.titleName}
                </span>
            </div>
        </div>
    );
};