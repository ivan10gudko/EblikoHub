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