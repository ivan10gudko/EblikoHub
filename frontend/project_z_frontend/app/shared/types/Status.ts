export enum Status {
    WATCHED = "WATCHED",
    PLANNED = "PLANNED",
    DROPPED = "DROPPED",
    INPROGRESS = "INPROGRESS",
    DEFAULT = "DEFAULT"
}

export const statusOptions = [
    { value: Status.PLANNED, label: "Plan to Watch" },
    { value: Status.WATCHED, label: "Watched" },
    { value: Status.DROPPED, label: "Dropped" },
    { value: Status.INPROGRESS, label: "In Progress" },
    { value: Status.DEFAULT, label: "No Status" },
];

export const statusColorConfig: Record<Status, { color: string; dot: string }> = {
    [Status.WATCHED]: {
        color: "text-green-500",
        dot: "bg-green-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
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


const baseInactiveStyle =
  "bg-card border border-border " +
  "hover:bg-background-muted hover:border-primary/40 " +
  "transition-all duration-200 shadow-sm";

export const statusFilterStyles: Record<
  Status | "ALL",
  { active: string; text: string; inactive: string }
> = {
  ALL: {
    text: "text-foreground",
    active:
      "bg-background-muted border border-border text-foreground shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },

  [Status.INPROGRESS]: {
    text: "text-primary",
    active:
      "bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },

  [Status.PLANNED]: {
    text: "text-blue-400",
    active:
      "bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },

  [Status.WATCHED]: {
    text: "text-green-500",
    active:
      "bg-green-500/10 border border-green-500/30 text-green-400 shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },

  [Status.DROPPED]: {
    text: "text-red-500",
    active:
      "bg-red-500/10 border border-red-500/30 text-red-500 shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },

  [Status.DEFAULT]: {
    text: "text-foreground",
    active:
      "bg-background-muted border border-border text-foreground shadow-md scale-[1.02]",
    inactive: baseInactiveStyle,
  },
};

export const statusOptionsFilters = [
    { label: "All", value: undefined },
    { label: "In Progress", value: Status.INPROGRESS },
    { label: "Planned", value: Status.PLANNED },
    { label: "Watched", value: Status.WATCHED },
    { label: "Dropped", value: Status.DROPPED },
];