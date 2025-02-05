import AllCustomers from "@/components/customers/all-customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers",
};

const Customers = () => {
  return (
    <section className="p-5">
      <AllCustomers />
    </section>
  );
};

export default Customers;
