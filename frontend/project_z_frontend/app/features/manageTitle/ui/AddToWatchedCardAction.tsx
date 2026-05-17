
import LibraryAddCheckOutlinedIcon from '@mui/icons-material/LibraryAddCheckOutlined';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import {useTitleRecordMutation, type ManageTitleRecordProps } from "~/entities/titleRecord";
import { FaSpinner } from "react-icons/fa";
import { Status } from '~/shared/types';


const AddToWatchedCardAction = ({ initialData, titleRecord }: ManageTitleRecordProps) => {
    const isWatched = titleRecord?.status === Status.WATCHED;
    console.log(initialData);
    const { isAnyActionLoading, updateStatus, deleteTitle } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord
    );

    function handleWatched(e: React.MouseEvent<HTMLLIElement>) {
        e.stopPropagation();
        if (isAnyActionLoading) return;
        console.log(titleRecord);
        if (isWatched && titleRecord?.titleId) {
            deleteTitle(titleRecord.titleId);
        } else {
            updateStatus(Status.WATCHED);
        }
    }

    return (
        <li onClick={handleWatched} className="cursor-pointer flex items-center justify-center">
            {isAnyActionLoading ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <>
                    {isWatched ? <LibraryAddCheckIcon fontSize="small" /> : <LibraryAddCheckOutlinedIcon fontSize="small" />}
                    <span className="ml-2">{isWatched ? "Remove from watched" : "Add to watched"}</span>
                </>
            )}
        </li>
    );
};
export default AddToWatchedCardAction;