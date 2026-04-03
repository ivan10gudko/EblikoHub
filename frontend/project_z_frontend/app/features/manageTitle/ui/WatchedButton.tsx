import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { Button } from "~/shared/ui/Button";
import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../hooks/useTitleRecordMutation";
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
            color="rgba(0,0,0,0.85)"
            borderColor="rgba(14,14,14,0.2)"
            bgColor={`rgba(236, 238, 242,${isAnyActionLoading ? "0.6" : "1"})`}
            className={isWatched ? "border-0 gap-3" : "border-[1px] gap-3"}
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
