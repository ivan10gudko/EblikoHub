import { apiClient, publicClient } from "~/shared/api";
import type { PageResponse } from "~/shared/types";
import type {
    Character,
    CharacterParams,
    CreateCharacter,
    ExternalCharacterPage,
} from "../model/character.types";

interface CharacterService {
    search(params?: CharacterParams): Promise<PageResponse<Character>>;
    getById(id: string): Promise<Character>;
    create(data: CreateCharacter): Promise<Character>;
    patch(id: string, data: Partial<Pick<Character, "name" | "imageUrl">>): Promise<Character>;
    delete(id: string): Promise<void>;
    searchExternal(query: string, page?: number): Promise<ExternalCharacterPage>;
}

export const characterService: CharacterService = {
    async search(params) {
        const { data } = await apiClient.get(`/characters/search`, { params });
        return data;
    },

    async getById(id) {
        const { data } = await apiClient.get(`/characters/${id}`);
        return data;
    },

    async create(payload) {
        const { data } = await apiClient.post(`/characters`, payload);
        return data;
    },

    async patch(id, payload) {
        const { data } = await apiClient.patch(`/characters/${id}`, payload);
        return data;
    },

    async delete(id) {
        await apiClient.delete(`/characters/${id}`);
    },

    //request to backend proxy with translations, NOT direct to externalProvider
    async searchExternal(query, page = 1) {
        const { data } = await publicClient.get(`/search/characters`, {
            params: { q: query, page },
        });
        return data;
    },
};
