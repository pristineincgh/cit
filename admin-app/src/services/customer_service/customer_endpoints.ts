import createAxiosInstance from '@/lib/axios-utils';
import { CustomerListResponse } from '@/types/customer_types';

const client = createAxiosInstance(true);

export const GET_CUSTOMERS = async (): Promise<CustomerListResponse> => {
  const response = await client.get<CustomerListResponse>('/customers');

  return response.data;
};
