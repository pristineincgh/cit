import AllCustomers from '@/components/customers/all-customers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customers',
};

const CustomersPage = () => {
  return (
    <section>
      <AllCustomers />
    </section>
  );
};

export default CustomersPage;
