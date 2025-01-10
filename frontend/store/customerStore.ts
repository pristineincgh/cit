import { CustomerShortDetails } from '@/app/(dashboard)/types/customer_schema';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CustomerState {
  customers: CustomerShortDetails[];
  setCustomers: (customers: CustomerShortDetails[]) => void;
  totalCustomers: number;
  setTotalCustomers: (totalCustomers: number) => void;
}

const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      customers: [],
      setCustomers: (customers) => set({ customers }),
      totalCustomers: 0,
      setTotalCustomers: (totalCustomers) => set({ totalCustomers }),
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCustomerStore;
