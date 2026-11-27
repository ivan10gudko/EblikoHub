import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TitleType, type TitleRecord } from "~/entities/titleRecord";
import { useUpdateTitleRecord } from "~/entities/titleRecord/hooks/useTitleRecordUpdateMutation";
import { notify } from "~/shared/lib/notify";
import type { EntityFormValues } from "~/shared/ui/EntityForm/EntityFormContext";
import { mergeRating, useEntityFormState } from "~/shared/ui/EntityForm/useEntityFormState";
import type { Character } from "~/entities/character";
import { useTitleCharacter } from "~/features/manageTitleCharacter";

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
    const { updateTitleAsync, isUpdating } = useUpdateTitleRecord(title.titleId);
    const { saveCharacter, isSavingCharacter } = useTitleCharacter(title.titleId);
    const [character, setCharacter] = useState<Character | null>(title.character ?? null);

    useEffect(() => {
        reset(toFormValues(title));
        setCharacter(title.character ?? null);
    }, [title]);

    const handleClose = () => navigate(-1);

    const handleSave = async () => {
        if (!values.name.trim()) {
            notify.error("Title name cannot be empty");
            return;
        }
        const hasCharacterChange = (character?.id ?? null) !== (title.character?.id ?? null);
        if (!isDirty && !hasCharacterChange) {
            handleClose();
            return;
        }

        try {
            if (hasCharacterChange) {
                await saveCharacter(character);
            }
            if (isDirty) {
                await updateTitleAsync({
                    titleName: values.name,
                    imageUrl: values.imageUrl,
                    status: values.status,
                    rating: mergeRating(title.rating, values.rating)!,
                    titleType: values.type as TitleType,
                    description: values.description,
                });
            }
            notify.success("Changes saved successfully");
            handleClose();
        } catch {
            // error toasts are shown by the mutations
        }
    };

    return {
        formState: values,
        setters,
        character,
        setCharacter,
        isPending: isUpdating || isSavingCharacter,
        handleClose,
        handleSave,
    };
};