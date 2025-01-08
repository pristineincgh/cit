import { TicketShortDetails } from '@/app/(dashboards)/types/tickets_schema';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface TicketState {
  tickets: TicketShortDetails[];
  setTickets: (tickets: TicketShortDetails[]) => void;
  totalTickets: number;
  setTotalTickets: (totalTickets: number) => void;
}

const useTicketStore = create<TicketState>()(
  persist(
    (set) => ({
      tickets: [],
      setTickets: (tickets) => set({ tickets }),
      totalTickets: 0,
      setTotalTickets: (totalTickets) => set({ totalTickets }),
    }),
    {
      name: 'ticket-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useTicketStore;
