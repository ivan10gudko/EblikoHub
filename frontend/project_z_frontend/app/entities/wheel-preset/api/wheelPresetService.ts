import { apiClient } from "~/shared/api";
import type { CreateWheelPreset, UpdateWheelPresetSettings, WheelPreset, WheelPresetShort } from "../model/wheelPreset.types";

interface WheelPresetService {
    getAll(): Promise<Array<WheelPresetShort>>;
    getById<T = unknown>(id: string): Promise<WheelPreset<T>>;
    create<T = unknown>(preset: CreateWheelPreset): Promise<WheelPreset<T>>;
    delete(id: string): Promise<void>;
    updateSettings<T = unknown>(settings: UpdateWheelPresetSettings): Promise<WheelPreset<T>>;
    addTitles(presetId: string, titleIds: Array<{ titleId: Number }>): Promise<void>;
    removeTitles(presetId: string, titleIds: Array<Number>): Promise<void>;
}

export const WheelPresetService: WheelPresetService = {
    getAll: async () => {
        const response = await apiClient.get<Array<WheelPresetShort>>("/wheel/presets");
        return response.data;
    },

    getById: async<T = unknown>(id: string) => {
        const response = await apiClient.get<WheelPreset<T>>(`/wheel/presets/${id}`);
        return response.data;
    },

    create: async<T = unknown>(preset: CreateWheelPreset) => {
        const response = await apiClient.post<WheelPreset<T>>("/wheel/presets", preset);
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/wheel/presets/${id}`);
    },

    updateSettings: async<T = unknown>(settings: UpdateWheelPresetSettings) => {
        const response = await apiClient.patch<WheelPreset<T>>("/wheel/presets/settings", settings);
        return response.data;
    },

    addTitles: async<T = unknown>(presetId: string, titleIds: Array<{ titleId: number }>) => {
        await apiClient.post(`/wheel/presets/${presetId}/titles`, { titleIds });
    },

    removeTitles: async<T = unknown>(presetId: string, titleIds: Array<number>) => {
        await apiClient.delete(`/wheel/presets/${presetId}/titles`, { data: { titleIds } });
    }
};