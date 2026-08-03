import { useQuery } from "@tanstack/react-query";
import { WheelCurrentService } from "../api/wheelCurrentService";
import type { WheelCurrent } from "../model/wheel.types";

export const useWheelCurrent = <T = unknown>() => {
    const { data: wheelCurrent, isLoading, isError, error } = useQuery<WheelCurrent<T>>({
        queryKey: ["wheelCurrent"],
        queryFn: async () => WheelCurrentService.get<T>(),
        staleTime: Infinity,
    });

    return { wheelCurrent, isLoading, isError, error };
}