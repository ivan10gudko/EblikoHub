import { useQuery } from '@tanstack/react-query';
import { userService } from '../api/UserService';


export const useUser = (userId: string | null) => {
    return useQuery({
        queryKey: ['user', userId], 
        queryFn: () => userService.getUser(userId!),

        enabled: !!userId,
        staleTime: 1000 * 60 * 5, 
    });
};