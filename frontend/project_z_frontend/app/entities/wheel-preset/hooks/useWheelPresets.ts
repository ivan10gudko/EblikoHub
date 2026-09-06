import { useQuery } from "@tanstack/react-query";
import { WheelPresetService } from "../api/wheelPresetService";
import { wheelPresetKeys } from "../model/wheelPreset.keys";
import type { WheelPresetShort } from "../model/wheelPreset.types";

export const useWheelPresets = () => {
    const { data: presets, isLoading, isError, error } = useQuery<Array<WheelPresetShort>>({
        queryKey: wheelPresetKeys.all,
        queryFn: () => WheelPresetService.getAll(),
        staleTime: Infinity,
    });

    return { presets, isLoading, isError, error };
};
