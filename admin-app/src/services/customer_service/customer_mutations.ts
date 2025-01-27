import { useMutation } from '@tanstack/react-query';
import {
  CREATE_CUSTOMER,
  DELETE_CUSTOMER,
  UPDATE_CUSTOMER,
} from './customer_endpoints';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { useCustomerStore } from '@/store/customerStore';
import { CustomerFormInput } from '@/types/customer_types';

export const useCreateCustomer = (setOpen: (value: boolean) => void) => {
  const { addCustomer } = useCustomerStore();

  return useMutation({
    mutationKey: ['create-customer'],
    mutationFn: CREATE_CUSTOMER,
    onSuccess: (data) => {
      addCustomer(data);
      toast.success('Customer added successfully');
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

export const useUpdateCustomer = (
  customerID: string,
  setOpen: (value: boolean) => void
) => {
  const { updateCustomer } = useCustomerStore();

  return useMutation({
    mutationKey: ['update-customer'],
    mutationFn: (customer_data: CustomerFormInput) =>
      UPDATE_CUSTOMER(customerID, customer_data),
    onSuccess: (data) => {
      updateCustomer(data);
      toast.success('Customer updated successfully');
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

export const useDeleteCustomer = (setOpen: (value: boolean) => void) => {
  const { deleteCustomer } = useCustomerStore();

  return useMutation({
    mutationKey: ['delete-customer'],
    mutationFn: (id: string) => DELETE_CUSTOMER(id),
    onSuccess: (_, id) => {
      deleteCustomer(id);
      setOpen(false);
      toast.success('Customer deleted successfully');
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
