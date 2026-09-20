import { DEFAULT_IMAGE_PATH } from "~/shared/constants";
import type { RoomTitleDetails } from "../../model/roomTitle.types"
import { UserAvatar } from "~/entities/user";
import { formatDate } from "~/shared/helpers";
import { Button } from "~/shared/ui/Button";
import EditIcon from "@mui/icons-material/Edit";
import { TitleTypeOptionsColors, TitleTypeThemes } from "~/entities/titleRecord";
interface RoomTitleDetailsModalProps {
    roomTitle: RoomTitleDetails;
    onEdit?: () => void;
}
export const ViewRoomTitleDetailsScreen = ({ roomTitle, onEdit }: RoomTitleDetailsModalProps) => {

    const typeColorClass = TitleTypeOptionsColors[roomTitle.titleType];

    const themeClasses = TitleTypeThemes[roomTitle.titleType];

    return (<div className="flex-1 flex flex-col p-6 rounded-2xl border border-border bg-card">
        <div className="flex gap-7">
            <div
                className={`w-[190px] h-[275px] rounded-xl overflow-hidden shrink-0 border border-border shadow-lg ${themeClasses}`}
            >
                <img
                    src={roomTitle.imageUrl || DEFAULT_IMAGE_PATH}
                    alt={roomTitle.titleName}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex flex-col min-w-0">
                <div>
                    <div className="text-xs font-semibold text-foreground-muted uppercase tracking-[0.2em] mb-2">
                        Room title
                    </div>

                    <h1 className="text-4xl font-bold leading-tight break-words">
                        {roomTitle.titleName}
                    </h1>
                </div>

                <div className="flex items-center gap-3 mt-auto">
                    <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                        Type:
                    </span>

                    <div
                        className={`inline-flex px-3 py-1 bg-background-muted rounded-lg text-sm font-bold ${typeColorClass}`}
                    >
                        {roomTitle.titleType}
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 pt-5 border-t border-border">
            <div className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-3">
                Added by
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0">
                    <UserAvatar
                        src={roomTitle.addedByUser.img ?? undefined}
                        name={roomTitle.addedByUser.name}
                        size="md"
                    />

                    <div className="min-w-0">
                        <div className="text-xl font-bold truncate">
                            {roomTitle.addedByUser.name}
                        </div>

                        <div className="text-sm text-foreground-muted truncate mt-0.5">
                            @{roomTitle.addedByUser.nameTag}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
            <div>
                <div className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-1">
                    Added
                </div>

                <div className="text-sm text-foreground-muted">
                    {formatDate(roomTitle.createdAt)}
                </div>
            </div>

            <Button
                variant="save"
                className="px-7 h-12 bg-primary hover:bg-primary-hover text-black border-none"
                onClick={onEdit}
            >
                <EditIcon className="mr-2" fontSize="small" />
                Edit Details
            </Button>
        </div>
    </div>);
}