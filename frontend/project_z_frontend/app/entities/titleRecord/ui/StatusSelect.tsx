import { type ManageTitleRecordProps } from "~/entities/titleRecord";
import { useTitleRecordMutation } from "..";
import {
  Status,
  statusColorConfig,
  statusOptions,
} from "~/shared/types/Status";
import { Select } from "~/shared/ui/Select/Select";
import { getStatusColor } from "~/shared/utils";

export interface StatusSelectProps extends ManageTitleRecordProps {
  className?: string;
  variant?: "page" | "card";
  onStatusChange?: (status: Status) => void;
  triggerColorClass?: string;
  getOptionClass?: (value: string | number) => string;
  getStatusColor?: (value: string | number) => string;
}

const StatusSelect = ({
  initialData,
  titleRecord,
  variant = "page",
  className = "",
  onStatusChange,
  triggerColorClass: externalTriggerColor,
  getOptionClass: externalGetOptionClass,
}: StatusSelectProps) => {
  const { updateStatus, isAnyActionLoading } = useTitleRecordMutation(
    initialData.apiTitleId,
    initialData,
    titleRecord,
  );

  const currentStatus = (titleRecord?.status as Status) || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];

  const handleStatusChange = (val: string) => {
    if (onStatusChange) {
      onStatusChange(val as Status);
    } else {
      updateStatus(val as Status);
    }
  };

  const styles = {
    page: className,
    card: `my-2 border-none bg-transparent rounded-none py-4 text-center transition-all ${className}`,
  };

  const finalTriggerColor =
    externalTriggerColor ||
    (currentStatus ? getStatusColor(currentStatus) : "text-foreground-muted");
  const finalGetOptionClass = externalGetOptionClass || getStatusColor;

  return (
    <div className="relative flex items-center w-full group">
      {currentStatus !== Status.DEFAULT && config?.dot && (
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
                    ${currentStatus !== Status.DEFAULT ? `pl-6` : "text-foreground-muted"}
                `}
        triggerColorClass={finalTriggerColor}
        getOptionClass={finalGetOptionClass}
      />
    </div>
  );
};

export default StatusSelect;
