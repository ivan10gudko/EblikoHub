import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../hooks/useTitleRecordMutation";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";
import { Select } from "~/shared/ui/Select";

const statusOptions = [
    { value: Status.PLANNED, label: "Plan to Watch" },
    { value: Status.WATCHED, label: "Watched" },
    { value: Status.DROPPED, label: "Dropped" },
    { value: Status.INPROGRESS, label: "In Progress" },
    { value: Status.DEFAULT, label: "No Status" },
];

const StatusSelect = ({ initialData, titleRecord }: ManageTitleRecordProps) => {
    const { updateStatus, isAnyActionLoading } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord,
    );

    const handleStatusChange = (val: string) => {
        updateStatus(val as Status);
    };

    return (
        <Select
            placeholder="Add to list..."
            options={statusOptions}
            value={titleRecord?.status || ""}
            onChange={handleStatusChange}
            disabled={isAnyActionLoading}
            className="pb-4"
        />
    );
};

export default StatusSelect;
