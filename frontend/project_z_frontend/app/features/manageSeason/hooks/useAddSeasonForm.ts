import { useState } from "react";
import type { AnimeCardType } from "~/entities/title";
import { useSeasons, type CreateSeasonDto } from "~/entities/season";
import { SeasonType } from "~/entities/season/model/season.types";
import { Status } from "~/shared/types/Status";
import { notify } from "~/shared/lib";
import type { EntityFormValues } from "~/shared/ui/EntityForm/EntityFormContext";
import { mergeRating, useEntityFormState } from "~/shared/ui/EntityForm/useEntityFormState";

const INITIAL_VALUES: EntityFormValues = {
    name: "",
    imageUrl: null,
    status: Status.INPROGRESS,
    type: SeasonType.TV,
    rating: undefined,
    description: "",
};

export const useAddSeasonForm = (titleId: number, onClose: () => void) => {
    const { values, setters, reset } = useEntityFormState(INITIAL_VALUES);
    const [apiTitleId, setApiTitleId] = useState<number | undefined>();
    const { createSeason, isPending } = useSeasons(titleId);

    const handleImport = (anime: AnimeCardType) => {
        setters.setName(anime.title);
        setters.setImageUrl(anime.img);
        setApiTitleId(anime.id);
    };

    const handleClear = () => {
        reset();
        setApiTitleId(undefined);
        notify.success("Form cleared");
    };

    const handleSave = () => {
        if (!values.name.trim()) {
            notify.error("Enter season name!");
            return;
        }

        const payload: CreateSeasonDto = {
            name: values.name,
            apiTitleId,
            status: values.status,
            type: values.type as SeasonType,
            imageUrl: values.imageUrl ?? "",
            rating: mergeRating(undefined, values.rating),
            description: values.description,
        };

        createSeason(payload, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return { formState: values, setters, isPending, handleImport, handleClear, handleSave };
};