import { useQuery } from '@tanstack/react-query';
import { userService } from '../api/UserService';

export const useBadges = () => {
    return useQuery({
        queryKey: ['badges'], 
        queryFn: () => userService.getBadges(),
        staleTime: 1000 * 60 * 5, 
    });
};