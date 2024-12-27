import AnalyticsCards from '@/components/dashboard/admin/analytics-cards';
import { RecentTicketsTable } from '@/components/dashboard/admin/recent-tickets-table';
import ReportDownloader from '@/components/dashboard/admin/report-downloader';
import React from 'react';

const AdminDashboard = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Dashboard</h1>

        <div>
          <ReportDownloader />
        </div>
      </div>
      <AnalyticsCards />
      <RecentTicketsTable />
    </>
  );
};

export default AdminDashboard;
