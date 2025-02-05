'use client';

import { useGetCustomers } from '@/services/customer_service/customer_query';
import { useCustomerStore } from '@/store/customerStore';
import { FC, useEffect, useState } from 'react';
import SearchBar from '../searchbar';
import Paginator from '../paginator';
import CustomerTable from './customer-table';
import AddCustomer from './add-customer';

interface NoResultsProps {
  message: string;
  description: string;
}

const AllCustomers = () => {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 100;

  const { data, isLoading } = useGetCustomers();
  const { customers, total_customers, setCustomers, setTotalCustomers } =
    useCustomerStore();

  useEffect(() => {
    if (data) {
      setCustomers(data.customers);
      setTotalCustomers(data.total);
    }
  }, [data, setCustomers, setTotalCustomers]);

  // filter customers based on the search query
  const filteredCustomers = customers.filter((customer) => {
    const matchName = customer.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchPhone = customer.phone_number.includes(search);
    return matchName || matchPhone;
  });

  // paginate customer list for the current page
  const paginatedCustomers = filteredCustomers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // A reusable component for displaying messages when no results or data are found.
  const NoResults: FC<NoResultsProps> = ({ message, description }) => (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{message}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 mt-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search customers..."
        />
        <CustomerTable isLoading />
      </div>
    );
  }

  if (!customers?.length) {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-xl text-muted-foreground">({total_customers})</p>
          </div>
          <AddCustomer />
        </div>
        <div className="space-y-4 mt-8">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search customers..."
          />
          <NoResults
            message="No customers found"
            description="You haven’t added any customer yet. Click on the button above to add one."
          />
        </div>
      </>
    );
  }

  if (!filteredCustomers.length) {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-xl text-muted-foreground">({total_customers})</p>
          </div>
          <AddCustomer />
        </div>
        <div className="space-y-4 mt-8">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search customers..."
          />
          <NoResults
            message="No results found"
            description="No customers match your search criteria. Try adjusting your queries."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-xl text-muted-foreground">({total_customers})</p>
        </div>
        <AddCustomer />
      </div>
      <div className="space-y-4 mt-8">
        <SearchBar
          search={search}
          setSearch={setSearch}
          placeholder="Search customers..."
        />

        <CustomerTable customers={paginatedCustomers} />
        <Paginator page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </>
  );
};

export default AllCustomers;
