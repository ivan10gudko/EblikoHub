import { useState } from "react";
import type { Rating } from "~/shared/types";
import type { EntityFormValues, EntityFormSetters } from "./EntityFormContext";

export const useEntityFormState = (initial: EntityFormValues) => {
    const [name, setName] = useState(initial.name);
    const [imageUrl, setImageUrl] = useState<string | null>(initial.imageUrl);
    const [status, setStatus] = useState(initial.status);
    const [type, setType] = useState(initial.type);
    const [rating, setRating] = useState<number | undefined>(initial.rating);
    const [description, setDescription] = useState(initial.description);

    const values: EntityFormValues = { name, imageUrl, status, type, rating, description };
    const setters: EntityFormSetters = {
        setName,
        setImageUrl,
        setStatus,
        setType,
        setRating,
        setDescription,
    };

    const reset = (next: EntityFormValues = initial) => {
        setName(next.name);
        setImageUrl(next.imageUrl);
        setStatus(next.status);
        setType(next.type);
        setRating(next.rating);
        setDescription(next.description);
    };

    const isDirty = (Object.keys(values) as Array<keyof EntityFormValues>).some(
        (key) => values[key] !== initial[key]
    );

    return { values, setters, reset, isDirty };
};

export const mergeRating = (prev: Rating | undefined, overall: number | undefined) => {
    if (overall !== undefined) return { ...prev, overall } as Rating;
    if (prev) {
        const { overall: _omit, ...rest } = prev;
        return rest as Rating;
    }
    return undefined;
};