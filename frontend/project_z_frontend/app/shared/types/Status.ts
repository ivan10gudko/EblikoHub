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
export const statusFilterStyles: Record<Status | 'ALL', { active: string; text: string }> = {
    [Status.INPROGRESS]: {
        text: "text-amber-500",
        active: "bg-amber-500/10 shadow-xs shadow-amber-500/30 text-amber-500"
    },
    [Status.PLANNED]: {
        text: "text-blue-500",
        active: "bg-blue-500/10 shadow-xs shadow-blue-500/30 text-blue-500"
    },
    [Status.WATCHED]: {
        text: "text-green-500",
        active: "bg-green-500/10 shadow-xs shadow-green-500/30 text-green-500"
    },
    [Status.DROPPED]: {
        text: "text-red-500",
        active: "bg-red-500/10 shadow-xs shadow-red-500/30 text-red-500"
    },
    [Status.DEFAULT]: {
        text: "text-foreground",
        active: "bg-primary text-background shadow-xs shadow-yellow-100"
    },
    ['ALL']: {
        text: "text-foreground",
        active: "bg-primary text-background shadow-xs shadow-yellow-100"
    }
};
export const statusOptionsFilters = [
    { label: "All", value: undefined },
    { label: "In Progress", value: Status.INPROGRESS },
    { label: "Planned", value: Status.PLANNED },
    { label: "Watched", value: Status.WATCHED },
    { label: "Dropped", value: Status.DROPPED },
];