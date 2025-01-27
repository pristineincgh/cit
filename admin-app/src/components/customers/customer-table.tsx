import { FC } from 'react';

import { Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';

import { Customer } from '@/types/customer_types';
import { Badge } from '../ui/badge';

interface CustomerTableProps {
  isLoading?: boolean;
  customers?: Customer[];
  onDelete?: (id: string) => void;
}

const LoadingRow = () => (
  <TableRow>
    {Array(4)
      .fill(null)
      .map((_, index) => (
        <TableCell key={index}>
          <Skeleton className={`h-6 w-${[180, 150, 120, 80][index]}px`} />
        </TableCell>
      ))}
    <TableCell className="text-right">
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </TableCell>
  </TableRow>
);

const CustomerTable: FC<CustomerTableProps> = ({
  isLoading = false,
  customers = [],
  onDelete = () => {},
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <LoadingRow key={index} />
              ))
            : customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium max-w-[280px] truncate">
                    {customer.name}
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>
                    <Badge>new</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Edit/Update</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update Customer Details</DialogTitle>
                            <DialogDescription className="sr-only">
                              Update customer details
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Conference</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this conference?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => onDelete(customer.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
