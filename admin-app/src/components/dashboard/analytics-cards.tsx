'use client';

// import StatsCard from './stats-card';
// import { TicketIcon, UserIcon, Users2Icon } from 'lucide-react';
// import ActivityCard from './activity-card';
// import { ReactNode, useEffect } from 'react';
// import useTicketStore from '@/store/ticketStore';
// import { useRetrieveAllTickets } from '@/app/(dashboard)/services/queries/ticket_queries';

// interface Metric {
//   label: string;
//   value: number;
//   trend: 'up' | 'down';
// }

// interface Card {
//   title: string;
//   total: number;
//   metrics: Metric[];
//   icon: ReactNode;
// }

const AnalyticsCards = () => {
  // const { data } = useRetrieveAllTickets();
  // const { totalTickets, setTickets, setTotalTickets } = useTicketStore();

  // const cards: Card[] = [
  //   {
  //     title: 'Total Tickets',
  //     total: 34,
  //     metrics: [
  //       { label: 'Resolved', value: 220, trend: 'up' },
  //       { label: 'Pending', value: 110, trend: 'down' },
  //     ],
  //     icon: <TicketIcon className="h-6 w-6 text-muted-foreground" />,
  //   },
  //   {
  //     title: 'Total Customers',
  //     total: 150,
  //     metrics: [
  //       { label: 'New', value: 55, trend: 'up' },
  //       { label: 'Old', value: 95, trend: 'down' },
  //     ],
  //     icon: <Users2Icon className="h-6 w-6 text-muted-foreground" />,
  //   },
  //   {
  //     title: 'Total Agents',
  //     total: 30,
  //     metrics: [
  //       { label: 'Active', value: 29, trend: 'up' },
  //       { label: 'Inactive', value: 1, trend: 'down' },
  //     ],
  //     icon: <UserIcon className="h-6 w-6 text-muted-foreground" />,
  //   },
  // ];

  // useEffect(() => {
  //   if (data) {
  //     setTickets(data.tickets);
  //     setTotalTickets(data.total);
  //   }
  // }, [data, setTickets, setTotalTickets]);

  return (
    <div className="my-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))} */}
      {/* <ActivityCard /> */}
    </div>
  );
};

export default AnalyticsCards;
