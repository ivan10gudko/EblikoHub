import type { WheelMode } from "~/shared/types";

export interface WheelCurrent<T = unknown> {
    userId: string,
    mode: WheelMode,
    spinDuration: number,
    updatedAt: string,
    titles: Array<WheelConfigTitle<T>>,
}

export interface WheelConfigTitle<T> {
    title: T;
    createdAt: string;
}

export interface CreateWheelCurrent {
    mode: WheelMode;
    spinDuration: number;
    titles: Array<{
        titleId: number;
    }>;
}

export interface UpdateWheelCurrentSettings {
    spinDuration: number;
    mode: WheelMode;
}

