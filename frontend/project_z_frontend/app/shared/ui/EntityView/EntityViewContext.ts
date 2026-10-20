import { createContext, useContext } from "react";
import type { Status } from "~/shared/types/Status";

export interface EntityViewValues {
    name: string;
    imageUrl?: string | null;
    status: Status;
    type?: string;
    rating?: number;
    avgRating?: number;
    description?: string;
}

export type EntityViewChanged = Partial<Record<keyof EntityViewValues, boolean>>;

interface EntityViewContextValue {
    values: EntityViewValues;
    changed: EntityViewChanged;
}

export const EntityViewContext = createContext<EntityViewContextValue | null>(null);

export const useEntityView = () => {
    const ctx = useContext(EntityViewContext);
    if (!ctx) throw new Error("EntityView.* must be used inside <EntityView>");
    return ctx;
};