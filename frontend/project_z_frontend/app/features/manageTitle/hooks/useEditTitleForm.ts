import { useEffect } from "react";
import { useNavigate } from "react-router";
import { TitleType, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { notify } from "~/shared/lib/notify";
import type { EntityFormValues } from "~/shared/ui/EntityForm/EntityFormContext";
import { mergeRating, useEntityFormState } from "~/shared/ui/EntityForm/useEntityFormState";

const toFormValues = (t: TitleRecord): EntityFormValues => ({
    name: t.titleName,
    imageUrl: t.imageUrl ?? null,
    status: t.status,
    type: t.titleType ?? TitleType.ANIME,
    rating: t.rating?.overall,
    description: t.description ?? "",
});

export const useEditTitleForm = (title: TitleRecord) => {
    const navigate = useNavigate();
    const { values, setters, reset, isDirty } = useEntityFormState(toFormValues(title));
    const { updateTitle, isUpdating } = useUpdateTitleRecord(title.titleId);

    useEffect(() => {
        reset(toFormValues(title));
    }, [title]);

    const handleClose = () => navigate(-1);

    const handleSave = () => {
        if (!values.name.trim()) {
            notify.error("Title name cannot be empty");
            return;
        }
        if (!isDirty) {
            handleClose();
            return;
        }

        updateTitle(
            {
                titleName: values.name,
                imageUrl: values.imageUrl,
                status: values.status,
                rating: mergeRating(title.rating, values.rating)!,
                titleType: values.type as TitleType,
                description: values.description,
            },
            {
                onSuccess: () => {
                    notify.success("Changes saved successfully");
                    handleClose();
                },
                onError: () => notify.error("Failed to save changes"),
            }
        );
    };

    return { formState: values, setters, isPending: isUpdating, handleClose, handleSave };
};