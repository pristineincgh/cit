import { useQuery } from '@tanstack/react-query';
import { GET_CUSTOMERS } from './customer_endpoints';

export const useGetCustomers = () => {
  return useQuery({
    queryKey: ['customers'],
    queryFn: GET_CUSTOMERS,
    refetchInterval: 30000,
    staleTime: 20000,
  });
};
