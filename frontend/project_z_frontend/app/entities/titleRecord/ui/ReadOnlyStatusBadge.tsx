import React from "react";
import {
  Status,
  statusColorConfig,
  statusOptions,
} from "~/shared/types/Status";

interface ReadOnlyStatusBadgeProps {
  status?: Status;
  className?: string;
}

export const getStatusLabel = (status?: Status): string => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : "In Progress";
};

export const ReadOnlyStatusBadge: React.FC<ReadOnlyStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const currentStatus = status || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];
  const isDefault = currentStatus === Status.DEFAULT;

  return (
    <div 
      className={`relative flex items-center justify-center sm:justify-start flex-shrink-0 p-0.5 sm:px-3 sm:py-1.5 bg-transparent text-[10px] font-black uppercase tracking-wider rounded-lg border-0 sm:border border-border w-6 sm:w-max min-w-[24px] sm:min-w-[110px] select-none pointer-events-none ${className}`}
    >
      {!isDefault && (
        <div
          className={`absolute sm:static w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full z-10 pointer-events-none sm:mr-2 ${config.dot}`}
        />
      )}
      
      <span
        className={`hidden sm:inline transition-all capitalize ${isDefault ? "text-foreground-muted" : config.color}`}
      >
        {getStatusLabel(currentStatus)}
      </span>
    </div>
  );
};