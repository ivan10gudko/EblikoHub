import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TitleRecord } from "~/entities/titleRecord";
import { titleRecordKeys } from "~/entities/titleRecord/model/titleRecord.queryKeys";
import { notify } from "~/shared/lib";
import { getErrorMessage } from "~/shared/utils";
import type { Character } from "~/entities/character";
import { titleCharacterApi } from "../api/titleCharacterApi";

/** Saves the favorite character of a title: link a character or unlink (null). */
export const useTitleCharacter = (titleId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (character: Character | null) =>
            character
                ? titleCharacterApi.link(titleId, character.id)
                : titleCharacterApi.unlink(titleId),
        onSuccess: (_updated, character) => {
            queryClient.setQueryData<TitleRecord | null>(titleRecordKeys.detail(titleId), (old) =>
                old ? { ...old, character } : old
            );
        },
        onError: (error) => {
            notify.error(getErrorMessage(error, "Could not save favorite character"));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: titleRecordKeys.all });
        },
    });

    return {
        saveCharacter: mutation.mutateAsync,
        isSavingCharacter: mutation.isPending,
    };
};
