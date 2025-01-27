'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Edit2 } from 'lucide-react';
import { useUpdateCustomer } from '@/services/customer_service/customer_mutations';
import CustomerForm from './customer-form';
import { Customer } from '@/types/customer_types';

const UpdateCustomer = ({ customer }: { customer: Customer }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: updateCustomer, isPending } = useUpdateCustomer(
    customer.id,
    setIsDialogOpen
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
          <span className="sr-only">Edit/Update</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Customer</DialogTitle>
          <DialogDescription>Update customer details</DialogDescription>
        </DialogHeader>

        <CustomerForm
          customer={customer}
          onSubmit={updateCustomer}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCustomer;
