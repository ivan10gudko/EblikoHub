import { type ManageTitleRecordProps } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "..";
import { Select } from "~/shared/ui/Select";
import { Status, statusColorConfig, statusOptions } from "~/shared/types/Status";


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

    const currentStatus = (titleRecord?.status as Status) || Status.DEFAULT;
    const config = statusColorConfig[currentStatus];

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

export default StatusSelect