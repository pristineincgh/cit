export interface Customer {
  id: string;
  name: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerListResponse {
  total: number;
  customers: Customer[];
}

export interface CustomerFormInput {
  name: string;
  phone_number: string;
}
