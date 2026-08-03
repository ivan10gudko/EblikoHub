import type { WheelMode } from "~/shared/types";

export interface WheelPresetShort {
    id: string,
    name: string,
    mode: WheelMode,
    titlesCount: number,
    createdAt: string,
}

export interface WheelPreset<T = unknown> {
    id: string,
    name: string,
    mode: WheelMode,
    spinDuration: number,
    createdAt: string,
    updatedAt: string,
    titles: Array<WheelConfigTitle<T>>,
}

export interface WheelConfigTitle<T> {
    title: T;
    createdAt: string;
}

export interface CreateWheelPreset {
    name: string;
    mode: WheelMode;
    spinDuration: number;
    titles: Array<{
        titleId: number;
    }>;
}

export interface UpdateWheelPresetSettings {
    name: string;
    spinDuration: number;
    mode: WheelMode;
}


