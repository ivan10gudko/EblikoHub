export const wheelPresetKeys = {
    all: ["wheelPresets"] as const,
    detail: (id: string) => ["wheelPresets", id] as const,
};
