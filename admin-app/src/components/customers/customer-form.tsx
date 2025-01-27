'use client';

import { customerFormSchema } from '@/lib/validations/customer_validations';
import { Customer, CustomerFormInput } from '@/types/customer_types';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CustomerFormInput) => void;
  isPending: boolean;
}

const CustomerForm: FC<CustomerFormProps> = ({
  customer,
  onSubmit,
  isPending,
}) => {
  const form = useForm<CustomerFormInput>({
    mode: 'all',
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name || '',

      // remove the + from the phone number
      phone_number: customer?.phone_number.replace('+', '') || '',
    },
  });

  const handleSubmit = (data: CustomerFormInput) => {
    // if phone number starts with 0, remove it and replace with +233
    const phoneNumber = data.phone_number;
    const formattedPhoneNumber = phoneNumber.startsWith('0')
      ? phoneNumber.replace('0', '+233')
      : phoneNumber.startsWith('233')
      ? phoneNumber.replace('233', '+233')
      : phoneNumber;

    const updatedData = {
      ...data,
      phone_number: formattedPhoneNumber,
    };
    onSubmit(updatedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className={`${
                    form.formState.errors.name ? 'border-red-500' : ''
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="233XXXXXXX or 0XXXXXXXXXX"
                  className={`${
                    form.formState.errors.phone_number ? 'border-red-500' : ''
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending || !form.formState.isValid}>
            {isPending
              ? 'Please wait...'
              : customer
              ? 'Update Customer'
              : 'Add Customer'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default CustomerForm;
