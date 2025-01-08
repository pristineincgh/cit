import { useQuery } from '@tanstack/react-query';
import { retrieveAllTickets } from '../endpoints/ticket_endpoints';

export const useRetrieveAllTickets = () => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: retrieveAllTickets,
    refetchInterval: 30000,
    // only update if the total number of tickets changes
    select: (data) => ({
      ...data,
      total: data.total,
    }),
    // only refetch if data is older than 20 seconds
    staleTime: 20000,
  });
};
