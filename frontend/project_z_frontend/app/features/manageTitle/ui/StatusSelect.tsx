import { Status, statusOptions } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "../../../entities/titleRecord";
import type { ManageTitleRecordProps } from "../model/manageTitleRecord";
import { Select } from "~/shared/ui/Select";


interface StatusSelectProps extends ManageTitleRecordProps {
    className?: string;
    variant?: "page" | "card";
}
const statusConfig: Record<Status, { color: string; dot: string }> = {
    [Status.WATCHED]: {
        color: "text-green-500",
        dot: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
    },
    [Status.PLANNED]: {
        color: "text-blue-400",
        dot: "bg-blue-400"
    },
    [Status.INPROGRESS]: {
        color: "text-primary",
        dot: "bg-primary animate-pulse"
    },
    [Status.DROPPED]: {
        color: "text-red-500",
        dot: "bg-red-500"
    },
    [Status.DEFAULT]: {
        color: "text-foreground-muted",
        dot: "bg-gray-500"
    },
};
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

    const currentStatus = (titleRecord?.status as Status) || Status.DEFAULT;
    const config = statusConfig[currentStatus];

    const handleStatusChange = (val: string) => {
        updateStatus(val as Status);
    };

    const styles = {
        page: className,
        card: `my-2 border-none bg-transparent rounded-none py-4 text-center transition-all ${className}`,
    };

    return (
        <div className="relative flex items-center w-full group">
            {currentStatus !== Status.DEFAULT && (
                <div
                    className={`absolute left-2 w-1.5 h-1.5 rounded-full z-10 pointer-events-none ${config.dot}`}
                />
            )}

            <Select
                placeholder="Add to list..."
                options={statusOptions}
                value={titleRecord?.status || ""}
                onChange={handleStatusChange}
                disabled={isAnyActionLoading}
                className={`
                    ${styles[variant]} 
                    ${currentStatus !== Status.DEFAULT ? `pl-6 ${config.color}` : "text-foreground-muted"}
                `}
                themeVariant={variant === "card" ? "dark" : "light"}
            />
        </div>
    );
};

export default StatusSelect;
