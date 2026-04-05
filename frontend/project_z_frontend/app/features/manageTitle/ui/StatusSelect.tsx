import { Status } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../../../entities/titleRecord";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";
import { Select } from "~/shared/ui/Select";

const statusOptions = [
    { value: Status.PLANNED, label: "Plan to Watch" },
    { value: Status.WATCHED, label: "Watched" },
    { value: Status.DROPPED, label: "Dropped" },
    { value: Status.INPROGRESS, label: "In Progress" },
    { value: Status.DEFAULT, label: "No Status" },
];
interface StatusSelectProps extends ManageTitleRecordProps {
    className?: string;
    variant?: "page" | "card";
}
const StatusSelect = ({
    initialData,
    titleRecord,
    variant = "page",
    className = "",
}: StatusSelectProps) => {
    const { updateStatus, isAnyActionLoading } = useTitleRecordMutation(
        initialData.apiTitleId,
        initialData,
        titleRecord,
    );

    const handleStatusChange = (val: string) => {
        updateStatus(val as Status);
    };

    const styles = {
        page: className,
        card: (className =
            "my-2 border-none hover:text-amber-400 bg-transparent rounded-none py-4 " +
            (titleRecord?.status ? "text-amber-300 text-center": "text-center") +
            className),
    };

    return (
        <Select
            placeholder="Add to list..."
            options={statusOptions}
            value={(titleRecord?.status?.trim().toUpperCase() as Status) || ""}
            onChange={handleStatusChange}
            disabled={isAnyActionLoading}
            className={styles[variant]}
            themeVariant={variant == "card" ? "dark" : "light"}
        />
    );
};

export default StatusSelect;
