import { useQuery } from '@tanstack/react-query';
import { GET_USERS } from './user_endpoints';

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: GET_USERS,
    refetchInterval: 30000,
    staleTime: 20000,
  });
};
