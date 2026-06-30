import {
  Status,
  statusColorConfig,
  statusOptions,
} from "~/shared/types/Status";
import { Select } from "~/shared/ui/Select/Select";
import { getStatusColor } from "~/shared/utils";

interface StatusHolder {
  status?: string | number | null;
}

export interface BaseStatusSelectProps<T extends StatusHolder> {
  data: T;
  onStatusChange: (status: Status) => void;
  isLoading?: boolean;
  variant?: "page" | "card";
  className?: string;
  triggerColorClass?: string;
  getOptionClass?: (value: string | number) => string;
}
export const BaseStatusSelect = <T extends StatusHolder>({
  data,
  onStatusChange,
  isLoading = false,
  variant = "page",
  className = "",
  triggerColorClass,
  getOptionClass,
}: BaseStatusSelectProps<T>) => {
  const currentStatus = (data.status as Status) || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];

  const styles = {
    page: className,
    card: `my-2 border-none pl-12 text-[14px] bg-transparent rounded-none py-4 transition-all text-center justify-center ${className}`,
  };

  const finalTriggerColor =
    triggerColorClass ||
    (currentStatus !== Status.DEFAULT
      ? getStatusColor(currentStatus)
      : "text-foreground-muted");

  const showDot =
    currentStatus !== Status.DEFAULT && config?.dot && variant === "page";

  return (
    <div className="relative flex items-center w-full group">
      {showDot && (
        <div
          className={`absolute left-2 w-1.5 h-1.5 rounded-full z-10 pointer-events-none ${config.dot}`}
        />
      )}

      <Select
        placeholder="Add to list..."
        options={statusOptions}
        value={data.status || ""}
        onChange={(val) => onStatusChange(val as Status)}
        disabled={isLoading}
        className={`
          ${styles[variant]} 
          ${showDot ? "pl-6" : ""} 
          ${currentStatus === Status.DEFAULT ? "text-foreground-muted" : ""}
        `}
        triggerColorClass={finalTriggerColor}
        getOptionClass={getOptionClass || getStatusColor}
      />
    </div>
  );
};
