import { Select } from "~/shared/ui/Select/Select";
import {
  Status,
  statusColorConfig,
  statusOptions,
} from "~/shared/types/Status";
import type { CreateSeasonDto, Season } from "~/entities/season";
import { getStatusColor } from "~/shared/utils";

export interface SeasonStatusSelectProps {
  initialData: CreateSeasonDto;
  titleRecord: Season | CreateSeasonDto;
  onStatusChange?: (status: Status) => void;
  isLoading?: boolean;
  variant?: "page" | "card";
  className?: string;
  triggerColorClass?: string;
  getOptionClass?: (value: string | number) => string;
  getStatusColor?: (value: string | number) => string;
}

const SeasonStatusSelect = ({
  titleRecord,
  onStatusChange,
  isLoading = false,
  variant = "page",
  className = "",
  triggerColorClass = "",
  getOptionClass,
}: SeasonStatusSelectProps) => {
  const currentStatus = (titleRecord?.status as Status) || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];

  const styles = {
    page: className,
    card: `my-2 border-none bg-transparent rounded-none py-4 text-center transition-all ${className}`,
  };

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
        onChange={(val) => onStatusChange?.(val as Status)}
        disabled={isLoading}
        className={`
                    ${styles[variant]} 
                    ${currentStatus !== Status.DEFAULT ? `pl-6` : "text-foreground-muted"}
                `}
        triggerColorClass={triggerColorClass}
        getOptionClass={getOptionClass || getStatusColor}
      />
    </div>
  );
};

export default SeasonStatusSelect;
