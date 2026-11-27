import type { CharacterParams } from "./character.types";

export const characterKeys = {
    all: ["characters"] as const,
    list: (params: CharacterParams) => [...characterKeys.all, "list", params] as const,
    external: (query: string, page: number) =>
        [...characterKeys.all, "external", query, page] as const,
};
