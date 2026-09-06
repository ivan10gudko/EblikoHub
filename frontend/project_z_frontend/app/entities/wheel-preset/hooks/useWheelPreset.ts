import { useQuery } from "@tanstack/react-query";
import { WheelPresetService } from "../api/wheelPresetService";
import { wheelPresetKeys } from "../model/wheelPreset.keys";
import type { WheelPreset } from "../model/wheelPreset.types";

export const useWheelPreset = <T = unknown>(id: string | undefined) => {
    const { data: preset, isLoading, isError, error } = useQuery<WheelPreset<T>>({
        queryKey: wheelPresetKeys.detail(id ?? ""),
        queryFn: () => WheelPresetService.getById<T>(id!),
        enabled: !!id,
        staleTime: Infinity,
    });

    return { preset, isLoading, isError, error };
};
