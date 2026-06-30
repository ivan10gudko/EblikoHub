import React from "react";
import { Status, statusColorConfig, statusOptions } from "~/shared/types";

interface ReadOnlyStatusBadgeProps {
  status?: Status;
}

const getStatusLabel = (status?: Status): string => {
  const option = statusOptions.find((opt) => opt.value === status);
  return option ? option.label : "In Progress";
};

export const ReadOnlyStatusBadge: React.FC<ReadOnlyStatusBadgeProps> = ({ status }) => {
  const currentStatus = status || Status.DEFAULT;
  const config = statusColorConfig[currentStatus];
  const isDefault = currentStatus === Status.DEFAULT;

  return (
    <div className="relative flex items-center flex-shrink-0 pl-7 pr-3 py-1.5 bg-transparent text-[10px] font-black uppercase tracking-wider rounded-lg border border-border min-w-[110px] w-max select-none pointer-events-none">
      {!isDefault && (
        <div
          className={`absolute left-2.5 w-1.5 h-1.5 rounded-full z-10 pointer-events-none ${config.dot}`}
        />
      )}
      <span
        className={`transition-all capitalize ${isDefault ? "text-foreground-muted" : config.color}`}
      >
        {getStatusLabel(currentStatus)}
      </span>
    </div>
  );
};
