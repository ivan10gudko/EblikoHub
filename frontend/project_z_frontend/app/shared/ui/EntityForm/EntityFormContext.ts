import { createContext, useContext } from "react";
import type { Status } from "~/shared/types/Status";

export interface EntityFormValues {
    name: string;
    imageUrl: string | null;
    status: Status;
    type: string;
    rating: number | undefined;
    description: string;
}

export interface EntityFormSetters {
    setName: (v: string) => void;
    setImageUrl: (v: string | null) => void;
    setStatus: (v: Status) => void;
    setType: (v: string) => void;
    setRating: (v: number | undefined) => void;
    setDescription: (v: string) => void;
}

interface EntityFormContextValue {
    values: EntityFormValues;
    setters: EntityFormSetters;
}

export const EntityFormContext = createContext<EntityFormContextValue | null>(null);

export const useEntityForm = () => {
    const ctx = useContext(EntityFormContext);
    if (!ctx) throw new Error("EntityForm.* must be used inside <EntityForm>");
    return ctx;
};