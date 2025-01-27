import createAxiosInstance from '@/lib/axios-utils';
import {
  CustomerFormInput,
  CustomerListResponse,
} from '@/types/customer_types';

const client = createAxiosInstance(true);

export const GET_CUSTOMERS = async (): Promise<CustomerListResponse> => {
  const response = await client.get<CustomerListResponse>('/customers');

  return response.data;
};

export const GET_CUSTOMER = async (id: string) => {
  const response = await client.get(`/customers/${id}`);

  return response.data;
};

export const CREATE_CUSTOMER = async (customer: CustomerFormInput) => {
  const response = await client.post('/customers', customer);

  return response.data;
};
