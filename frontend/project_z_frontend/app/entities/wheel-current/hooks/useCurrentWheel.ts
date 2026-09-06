import { useQuery } from "@tanstack/react-query";
import { WheelCurrentService } from "../api/wheelCurrentService";
import { wheelCurrentKeys } from "../model/wheelCurrent.keys";
import type { WheelCurrent } from "../model/wheel.types";

export const useCurrentWheel = <T = unknown>() => {
    const { data: wheelCurrent, isLoading, isError, error } = useQuery<WheelCurrent<T>>({
        queryKey: wheelCurrentKeys.all,
        queryFn: async () => WheelCurrentService.get<T>(),
        staleTime: Infinity,
    });

    return { wheelCurrent, isLoading, isError, error };
};
