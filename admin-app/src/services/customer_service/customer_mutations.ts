import { useMutation } from '@tanstack/react-query';
import { CREATE_CUSTOMER } from './customer_endpoints';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useCustomerStore } from '@/store/customerStore';

export const useCreateCustomer = (setOpen: (value: boolean) => void) => {
  const { addCustomer } = useCustomerStore();

  return useMutation({
    mutationKey: ['create-customer'],
    mutationFn: CREATE_CUSTOMER,
    onSuccess: (data) => {
      console.log('Customer created:', data);
      addCustomer(data);
      setOpen(false);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.detail);
      } else {
        toast.error(`An error occurred: ${error.message}`);
      }

      setOpen(true);
    },
  });
};
