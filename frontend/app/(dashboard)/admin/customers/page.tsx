'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Filter, Plus, SquarePen, Trash } from 'lucide-react';
import { useState } from 'react';
import { customers as customer_list } from '@/data/customers';
import { CustomerFormData } from '../../types/customer_schema';
import { Badge } from '@/components/ui/badge';
import { DeleteAlert } from '@/components/dashboard/customers/delete-customer-alert';
import { CustomerForm } from '@/components/dashboard/customers/customer-form';

const ITEMS_PER_PAGE = 5;
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const Customers = () => {
  const [customers, setCustomers] = useState(customer_list);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<string | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<string | null>(null);

  // Filter customers based on active tab and search term
  const filteredCustomers = customers
    .map((customer) => ({
      ...customer,
      isNew: new Date(customer.created_at) > thirtyDaysAgo, // Check if customer is new
    }))
    .filter((customer) => {
      const matchesTab =
        activeTab === 'all' || (activeTab === 'new' && customer.isNew);

      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number.includes(searchTerm);

      return matchesTab && matchesSearch;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle checkbox selection
  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map((customer) => customer.id));
    }
  };

  const toggleSelectCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleAddCustomer = (data: CustomerFormData) => {
    const newCustomer = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      isNew: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCustomers((prev) => [...prev, newCustomer]);
    setIsAddCustomerOpen(false);
  };

  const handleEditCustomer = (data: CustomerFormData) => {
    if (!editingCustomer) return;

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === editingCustomer ? { ...customer, ...data } : customer
      )
    );
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = () => {
    if (!deletingCustomer) return;

    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== deletingCustomer)
    );
    setDeletingCustomer(null);
  };

  const editingCustomerData = editingCustomer
    ? {
        name: customers.find((c) => c.id === editingCustomer)?.name || '',
        phone_number:
          customers.find((c) => c.id === editingCustomer)?.phone_number || '',
      }
    : {
        name: '',
        phone_number: '',
      };

  const deletingCustomerData = deletingCustomer
    ? customers.find((c) => c.id === deletingCustomer)
    : null;

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-[600px]"
          >
            <TabsList>
              <TabsTrigger value="all">All Customers</TabsTrigger>
              <TabsTrigger value="new">New Customers</TabsTrigger>
              <TabsTrigger value="europe">From Europe</TabsTrigger>
              <TabsTrigger value="asia">Asia</TabsTrigger>
              <TabsTrigger value="others">Others</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddCustomerOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customers
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Search customer..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedCustomers.length === paginatedCustomers.length &&
                      paginatedCustomers.length > 0
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Pending Issues</TableHead>
                <TableHead className="text-center">Resolved Issues</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCustomers.includes(customer.id)}
                      onCheckedChange={() => toggleSelectCustomer(customer.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell className="text-center">
                    {customer.isNew ? (
                      <Badge className="bg-green-500">new</Badge>
                    ) : (
                      <Badge variant={'outline'}>old</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">7</TableCell>
                  <TableCell className="flex items-center justify-center space-x-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-primary border-primary hover:bg-primary hover:text-white"
                      onClick={() => setEditingCustomer(customer.id)}
                    >
                      <SquarePen className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => setDeletingCustomer(customer.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {generatePaginationNumbers().map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>

        <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmit={handleAddCustomer}
              onCancel={() => setIsAddCustomerOpen(false)}
              mode="add"
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editingCustomer}
          onOpenChange={() => setEditingCustomer(null)}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
            </DialogHeader>
            <CustomerForm
              onSubmit={handleEditCustomer}
              onCancel={() => setEditingCustomer(null)}
              defaultValues={editingCustomerData}
              mode="edit"
            />
          </DialogContent>
        </Dialog>

        <DeleteAlert
          isOpen={!!deletingCustomer}
          onOpenChange={() => setDeletingCustomer(null)}
          onConfirm={handleDeleteCustomer}
          customerName={deletingCustomerData?.name || ''}
        />
      </div>
    </div>
  );
};

export default Customers;
