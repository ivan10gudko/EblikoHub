import React from 'react';
import { Status, statusColorConfig } from "~/shared/types/Status";

interface ReadOnlyStatusBadgeProps {
  status?: string;
}

export const getStatusLabel = (status?: string): string => {
  if (!status) return "In Progress";
  const normalized = status.toUpperCase().replace(/_/g, '');
  
  if (normalized === "WATCHING" || normalized === "INPROGRESS") {
    return "In Progress";
  }
  if (normalized === "COMPLETED" || normalized === "WATCHED") {
    return "Watched";
  }
  if (normalized === "DROPPED") return "Dropped";
  if (normalized === "PLANNED") return "Planned";
  
  return status;
};

export const ReadOnlyStatusBadge: React.FC<ReadOnlyStatusBadgeProps> = ({ status }) => {
  const currentStatus = (status as Status) || Status.DEFAULT;
  const config = statusColorConfig[currentStatus] || { color: "text-foreground-muted", dot: "bg-muted" };
  const isDefault = currentStatus === Status.DEFAULT;

  return (
    <div className="relative flex items-center flex-shrink-0 pl-7 pr-3 py-1.5 bg-transparent text-[10px] font-black uppercase tracking-wider rounded-lg border border-border min-w-[110px] w-max select-none pointer-events-none">
      
      {!isDefault && (
        <div className={`absolute left-2.5 w-1.5 h-1.5 rounded-full z-10 pointer-events-none ${config.dot}`} />
      )}

      <span className={`transition-all capitalize ${isDefault ? "text-foreground-muted" : config.color}`}>
        {getStatusLabel(status)}
      </span>
      
    </div>
  );
};