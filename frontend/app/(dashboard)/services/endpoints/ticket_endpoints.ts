import { TicketList } from '../../types/tickets_schema';
import { clientWithToken as client } from '@/lib/axios-utils';

export const retrieveAllTickets = async (): Promise<TicketList> => {
  const response = await client.get('/tickets/');

  return response.data;
};
