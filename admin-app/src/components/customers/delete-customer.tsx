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
import { useDeleteCustomer } from '@/services/customer_service/customer_mutations';
import { Customer } from '@/types/customer_types';
import { Trash2 } from 'lucide-react';

const DeleteCustomer = ({ customer }: { customer: Customer }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: deleteCustomer, isPending } =
    useDeleteCustomer(setIsDialogOpen);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Customer</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{customer.name}</strong>{' '}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={() => deleteCustomer(customer.id)}
            disabled={isPending}
          >
            {isPending ? 'Please wait...' : 'Delete Customer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCustomer;
