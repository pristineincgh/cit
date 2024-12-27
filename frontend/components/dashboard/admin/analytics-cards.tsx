import React from 'react';
import StatsCard from './stats-card';
import { TicketIcon, UserIcon, Users2Icon } from 'lucide-react';
import ActivityCard from './activity-card';

const cards = [
  {
    title: 'Total Tickets',
    total: 330,
    metrics: [
      { label: 'Resolved', value: 220, trend: 'up' as 'up' | 'down' },
      { label: 'Pending', value: 110, trend: 'down' as 'up' | 'down' },
    ],
    icon: <TicketIcon className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: 'Total Customers',
    total: 150,
    metrics: [
      { label: 'New', value: 55, trend: 'up' as 'up' | 'down' },
      { label: 'Old', value: 95, trend: 'down' as 'up' | 'down' },
    ],
    icon: <Users2Icon className="h-6 w-6 text-muted-foreground" />,
  },
  {
    title: 'Total Agents',
    total: 30,
    metrics: [
      { label: 'Active', value: 29, trend: 'up' as 'up' | 'down' },
      { label: 'Inactive', value: 1, trend: 'down' as 'up' | 'down' },
    ],
    icon: <UserIcon className="h-6 w-6 text-muted-foreground" />,
  },
];

const AnalyticsCards = () => {
  return (
    <div className="my-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
      <ActivityCard />
    </div>
  );
};

export default AnalyticsCards;
