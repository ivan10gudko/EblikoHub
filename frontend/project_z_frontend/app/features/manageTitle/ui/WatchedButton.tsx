import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../../../entities/titleRecord";
import { FaSpinner } from "react-icons/fa";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";

const WatchedButton = ({
    initialData,
    titleRecord,
}: ManageTitleRecordProps) => {
    const isWatched = titleRecord?.status == Status.WATCHED;
    const { isAnyActionLoading, updateStatus, deleteTitle } =
        useTitleRecordMutation(
            initialData.apiTitleId,
            initialData,
            titleRecord,
        );

    function handleWatched(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        if (!isWatched) {
            updateStatus(Status.WATCHED);
        } else {
            deleteTitle(titleRecord?.titleId);
        }
    }

    return (
        <Button
            variant={isWatched ? "fill" : "outline"}
            className={`
                gap-3 transition-opacity
                ${isWatched ? "border-none bg-background text-foreground/85" : "border-foreground/20 text-foreground/85"}
                ${isAnyActionLoading ? "opacity-60 cursor-not-allowed" : "opacity-100"}
            `}
            onClick={handleWatched}
            disabled={isAnyActionLoading}
        >
            {isAnyActionLoading ? (
                <FaSpinner className="animate-spin" />
            ) : isWatched ? (
                <>
                    <LibraryAddCheckIcon fontSize="small" />
                    Remove from watched
                </>
            ) : (
                <>
                    <LibraryAddCheckOutlinedIcon fontSize="small" />
                    Add to watched
                </>
            )}
        </Button>
    );
};

export default WatchedButton;
