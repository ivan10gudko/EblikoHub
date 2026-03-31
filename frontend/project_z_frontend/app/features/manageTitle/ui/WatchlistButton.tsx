import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../hooks/useTitleRecordMutation";
import { FaSpinner } from "react-icons/fa";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";

const WatchlistButton = ({
    initialData,
    titleRecord,
}: ManageTitleRecordProps) => {
    const isInWatchlist = titleRecord?.status == Status.PLANNED;
    const { updateStatus, deleteTitle, isAnyActionLoading } =
        useTitleRecordMutation(initialData.apiTitleId, initialData);

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
            color="rgba(0,0,0,0.85)"
            borderColor="rgba(14,14,14,0.2)"
            bgColor={`rgba(236, 238, 242,${isAnyActionLoading ? "0.6" : "1"})`}
            className={isInWatchlist ? "border-0 gap-3" : "border-[1px] gap-3"}
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
                    Add to watchlist
                </>
            )}
        </Button>
    );
};

export default WatchlistButton;
