import { apiClient } from "~/shared/api";
import type { TitleRecord } from "~/entities/titleRecord";

export const titleCharacterApi = {
    /** Sets the favorite character of the title (titles.character_id). */
    async link(titleId: number, characterId: string): Promise<TitleRecord> {
        const { data } = await apiClient.post<TitleRecord>(
            `/title-characters/link/${titleId}/${characterId}`
        );
        return data;
    },
    /** Removes only the link, the character stays in the user's catalog. */
    async unlink(titleId: number): Promise<TitleRecord> {
        const { data } = await apiClient.delete<TitleRecord>(`/title-characters/unlink/${titleId}`);
        return data;
    },
};
