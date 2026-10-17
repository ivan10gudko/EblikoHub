import { useState } from "react";
import { useNavigate } from "react-router";
import type { AnimeCardType } from "~/entities/title";
import { TitleType, useCreateTitleRecord, type CreateTitleRecord } from "~/entities/titleRecord";
import { Status } from "~/shared/types/Status";
import { notify } from "~/shared/lib";
import type { EntityFormValues } from "~/shared/ui/EntityForm/EntityFormContext";
import { mergeRating, useEntityFormState } from "~/shared/ui/EntityForm/useEntityFormState";

const INITIAL_VALUES: EntityFormValues = {
    name: "",
    imageUrl: null,
    status: Status.INPROGRESS,
    type: TitleType.ANIME,
    rating: undefined,
    description: "",
};

export const useAddTitleForm = () => {
    const navigate = useNavigate();
    const { values, setters, reset } = useEntityFormState(INITIAL_VALUES);
    const [apiTitleId, setApiTitleId] = useState<number | undefined>();
    const { createNewTitleRecord, isCreating } = useCreateTitleRecord();

    const handleClose = () => navigate("..", { relative: "path" });

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
            notify.error("Enter name!");
            return;
        }

        const payload: CreateTitleRecord = {
            titleName: values.name,
            apiTitleId,
            status: values.status,
            titleType: values.type as TitleType,
            imageUrl: values.imageUrl,
            rating: mergeRating(undefined, values.rating),
            pinned: false,
            description: values.description,
        };

        createNewTitleRecord(payload, {
            onSuccess: () => {
                notify.success("Added!");
                reset();
                handleClose();
            },
        });
    };

    return {
        formState: values,
        setters,
        isPending: isCreating,
        handleImport,
        handleClear,
        handleClose,
        handleSave,
    };
};