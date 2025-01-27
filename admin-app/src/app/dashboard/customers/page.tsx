import AllCustomers from '@/components/customers/all-customers';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

const CustomersPage = () => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Conferences</h1>
        <Link href="/dashboard/conferences/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <AllCustomers />
    </section>
  );
};

export default CustomersPage;
