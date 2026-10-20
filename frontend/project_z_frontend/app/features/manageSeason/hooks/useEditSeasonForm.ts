import { useEffect } from "react";
import { useNavigate } from "react-router";
import { SeasonType, type Season } from "~/entities/season/model/season.types";
import { useSeasonActions } from "~/entities/season";
import { notify } from "~/shared/lib/notify";
import type { EntityFormValues } from "~/shared/ui/EntityForm/EntityFormContext";
import { mergeRating, useEntityFormState } from "~/shared/ui/EntityForm/useEntityFormState";

const toFormValues = (s: Season): EntityFormValues => ({
    name: s.name,
    imageUrl: s.imageUrl ?? null,
    status: s.status,
    type: s.type ?? SeasonType.TV,
    rating: s.rating?.overall,
    description: s.description ?? "",
});

export const useEditSeasonForm = (titleId: number, season: Season) => {
    const navigate = useNavigate();
    const { values, setters, reset, isDirty } = useEntityFormState(toFormValues(season));
    const { updateSeason, isUpdating } = useSeasonActions(titleId);

    useEffect(() => {
        reset(toFormValues(season));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [season]);

    const handleClose = () => navigate(-1);

    const handleSave = () => {
        if (!values.name.trim()) {
            notify.error("Season name cannot be empty");
            return;
        }
        if (!isDirty) {
            handleClose();
            return;
        }

        updateSeason(season.seasonId, {
            name: values.name,
            imageUrl: values.imageUrl ?? undefined,
            status: values.status,
            rating: mergeRating(season.rating, values.rating),
            type: values.type as SeasonType,
            description: values.description,
        });

        notify.success("Changes saved successfully");
        handleClose();
    };

    return { formState: values, setters, isPending: isUpdating, handleClose, handleSave };
};