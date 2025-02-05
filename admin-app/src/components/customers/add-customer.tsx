"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useCreateCustomer } from "@/services/customer_service/customer_mutations";
import CustomerForm from "./customer-form";

const AddCustomer = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: addCustomer, isPending } = useCreateCustomer(setIsDialogOpen);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Add a new customer to your database. Fill in the form below to get
            started.
          </DialogDescription>
        </DialogHeader>

        <CustomerForm onSubmit={addCustomer} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomer;
