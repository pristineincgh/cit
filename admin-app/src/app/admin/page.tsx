import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

const AdminDashboard = () => {
  return (
    <>
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
    </>
  );
};

export default AdminDashboard;
