import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../../../entities/titleRecord";
import { FaSpinner } from "react-icons/fa";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";

const WatchlistButton = ({
    initialData,
    titleRecord,
}: ManageTitleRecordProps) => {
    const isInWatchlist = titleRecord?.status == Status.PLANNED;
    const { updateStatus, deleteTitle, isAnyActionLoading } =
        useTitleRecordMutation(
            initialData.apiTitleId,
            initialData,
            titleRecord,
        );

    function handleClick(e: React.MouseEvent<HTMLElement>) {
        e.stopPropagation();
        if (!isInWatchlist) {
            updateStatus(Status.PLANNED);
        } else {
            deleteTitle(titleRecord?.titleId);
        }
    }

    return (
        <Button
            variant={isInWatchlist ? "fill" : "outline"}
            className={`
                gap-3 transition-opacity
                ${isInWatchlist ? "border-none bg-background text-foreground/85" : "border-foreground/20 text-foreground/85"}
                ${isAnyActionLoading ? "opacity-60 cursor-not-allowed" : "opacity-100"}
                `}
            onClick={handleClick}
            disabled={isAnyActionLoading}
        >
            {isAnyActionLoading ? (
                <FaSpinner className="animate-spin" />
            ) : isInWatchlist ? (
                <>
                    <WatchLaterIcon fontSize="small" />
                    Remove from watchlist
                </>
            ) : (
                <>
                    <WatchLaterOutlinedIcon fontSize="small" />
                    Plan to Watch
                </>
            )}
        </Button>
    );
};

export default WatchlistButton;
