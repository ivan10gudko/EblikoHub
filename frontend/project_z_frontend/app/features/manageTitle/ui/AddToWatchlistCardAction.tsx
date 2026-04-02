import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { FaSpinner } from "react-icons/fa";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";
import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../hooks/useTitleRecordMutation";

const AddToWatchlistCardAction = ({ initialData, titleRecord }: ManageTitleRecordProps) => {
    const isPlanned = titleRecord?.status === Status.PLANNED;
    
    const { isAnyActionLoading, updateStatus, deleteTitle } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData
    );

    function handleWatchlist(e: React.MouseEvent<HTMLLIElement>) {
        e.stopPropagation();
        if (isAnyActionLoading) return;

        if (isPlanned && titleRecord?.titleId) {
            deleteTitle(titleRecord.titleId);
        } else {
            updateStatus(Status.PLANNED);
        }
    }

    return (
        <li onClick={handleWatchlist} className="cursor-pointer flex items-center justify-center">
            {isAnyActionLoading ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <>
                    {isPlanned ? (
                        <WatchLaterIcon fontSize="small" />
                    ) : (
                        <WatchLaterOutlinedIcon fontSize="small" />
                    )}
                    <span className="ml-2">
                        {isPlanned ? "Remove from watchlist" : "Add to watchlist"}
                    </span>
                </>
            )}
        </li>
    );
};

export default AddToWatchlistCardAction;