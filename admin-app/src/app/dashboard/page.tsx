import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

const AdminDashboard = () => {
  return (
    <section className="p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <Button>
          <Plus />
          <span>New Ticket</span>
        </Button>

        {/* <div>
          <ReportDownloader />
        </div> */}
      </div>
      {/* <AnalyticsCards />
      <RecentTicketsTable /> */}
    </section>
  );
};

export default AdminDashboard;
