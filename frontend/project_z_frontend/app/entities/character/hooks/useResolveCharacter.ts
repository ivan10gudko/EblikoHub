import { useMutation, useQueryClient } from "@tanstack/react-query";
import { characterService } from "../api/characterService";
import { characterKeys } from "../model/character.queryKeys";
import type { Character, CharacterChoice } from "../model/character.types";

/**
 * Turns any combobox choice into a character from the user's catalog:
 * - own character  -> returned as is;
 * - Tenrai result  -> reuses the existing record with the same apiId, otherwise imports it;
 * - custom         -> creates a new record.
 * The backend also rejects duplicates by (user_id, mal_id), the lookup here just avoids the error.
 */
export const resolveCharacter = async (choice: CharacterChoice): Promise<Character> => {
    if (choice.source === "own") return choice.character;

    if (choice.source === "custom") {
        return characterService.create({
            name: choice.character.name.trim(),
            imageUrl: choice.character.imageUrl?.trim() || null,
            apiId: null,
        });
    }

    const { malId, name, imageUrl } = choice.character;

    const findExisting = async () => {
        const page = await characterService.search({ search: name, page: 0, limit: 50 });
        return page.content.find((c) => c.apiId === malId) ?? null;
    };

    const existing = await findExisting().catch(() => null);
    if (existing) return existing;

    try {
        return await characterService.create({ name, imageUrl, apiId: malId });
    } catch (error) {
        // created in parallel / name changed: fall back to the record that already exists
        const fallback = await findExisting().catch(() => null);
        if (fallback) return fallback;
        throw error;
    }
};

export const useResolveCharacter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: resolveCharacter,
        onSuccess: (_character, choice) => {
            if (choice.source !== "own") {
                queryClient.invalidateQueries({ queryKey: [...characterKeys.all, "list"] });
            }
        },
    });
};
