import { statusColorConfig, type Status } from "../types";

export const getStatusColor = (optionValue: string | number) => {
    const valStr = String(optionValue) as Status;
    if (statusColorConfig && statusColorConfig[valStr]) {
        return statusColorConfig[valStr].color;
    }
    return "text-foreground";
};