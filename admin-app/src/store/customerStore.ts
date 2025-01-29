import { Customer } from '@/types/customer_types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CustomerStore {
  customers: Customer[];
  total_customers: number;
  setCustomers: (customers: Customer[]) => void;
  setTotalCustomers: (total_customers: number) => void;
  addCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  updateCustomer: (customer: Customer) => void;
  getCustomer: (id: string) => Customer | null;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: [],
      total_customers: 0,
      setCustomers: (customers) => set({ customers }),
      setTotalCustomers: (total_customers) => set({ total_customers }),
      addCustomer: (customer) =>
        set((state) => ({
          // add customer to the top of the list
          customers: [customer, ...state.customers],
          total_customers: state.total_customers + 1,
        })),
      deleteCustomer: (id) =>
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
          total_customers: state.total_customers - 1,
        })),
      updateCustomer: (customer) =>
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === customer.id ? customer : c
          ),
        })),
      getCustomer: (id) =>
        get().customers.find((customer) => customer.id === id) || null,
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
