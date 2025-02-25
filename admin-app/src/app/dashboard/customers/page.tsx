import AddCustomer from '@/components/customers/add-customer';
import AllCustomers from '@/components/customers/all-customers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

const CustomersPage = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <AddCustomer />
      </div>

      <AllCustomers />
    </section>
  );
};

export default CustomersPage;
