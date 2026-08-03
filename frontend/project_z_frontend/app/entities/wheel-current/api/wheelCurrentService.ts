import { apiClient } from "~/shared/api";
import type { CreateWheelCurrent, UpdateWheelCurrentSettings, WheelCurrent } from "../model/wheel.types";
interface WheelCurrentService {
    get<T = unknown>(): Promise<WheelCurrent<T>>;
    create<T = unknown>(preset: CreateWheelCurrent): Promise<WheelCurrent<T>>;
    updateSettings<T = unknown>(settings: UpdateWheelCurrentSettings): Promise<WheelCurrent<T>>;
    loadPreset<T = unknown>(presetId: string): Promise<WheelCurrent<T>>;
    addTitles(titleIds: Array<{ titleId: Number }>): Promise<void>;
    removeTitles(titleIds: Array<Number>): Promise<void>;
}

export const WheelCurrentService: WheelCurrentService = {
    get: async<T = unknown>() => {
        const response = await apiClient.get<WheelCurrent<T>>("/wheel/settings");
        return response.data;
    },

    create: async<T = unknown>(current: CreateWheelCurrent) => {
        const response = await apiClient.post<WheelCurrent<T>>("/wheel/settings", current);
        return response.data;
    },

    updateSettings: async<T = unknown>(settings: UpdateWheelCurrentSettings) => {
        const response = await apiClient.patch<WheelCurrent<T>>("/wheel/settings/settings", settings);
        return response.data;
    },

    loadPreset: async<T = unknown>(presetId: string) => {
        const response = await apiClient.post<WheelCurrent<T>>(`/wheel/settings/load-preset`, { "presetId": presetId });
        return response.data;
    },

    addTitles: async (titleIds: Array<{ titleId: number }>) => {
        await apiClient.post(`/wheel/settings/titles`, { titleIds });
    },

    removeTitles: async (titleIds: Array<number>) => {
        await apiClient.delete(`/wheel/settings/titles`, { data: { titleIds } });
    }
};