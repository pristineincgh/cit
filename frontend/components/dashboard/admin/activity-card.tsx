'use client';

import { FC } from 'react';
import { UserPlus, Ticket, UserCheck, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Activity } from '@/app/(dashboard)/types/activity_schema';

const activities: Activity[] = [
  {
    id: '1',
    type: 'new_customer',
    user: 'John Doe',
    details: 'Created a new customer: Acme Corp',
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    type: 'assign_ticket',
    user: 'Jane Smith',
    details: 'Assigned ticket #1234 to Mark Johnson',
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    type: 'new_ticket',
    user: 'Alice Brown',
    details: 'Created ticket #5678: Server downtime issue',
    timestamp: '5 hours ago',
  },
  {
    id: '4',
    type: 'complete_ticket',
    user: 'Mark Johnson',
    details: 'Marked ticket #9012 as completed',
    timestamp: '1 day ago',
  },
];

const ActivityIcon: FC<{ type: Activity['type'] }> = ({ type }) => {
  switch (type) {
    case 'new_customer':
      return <UserPlus className="h-5 w-5 text-blue-500" />;
    case 'new_ticket':
      return <Ticket className="h-5 w-5 text-green-500" />;
    case 'assign_ticket':
      return <UserCheck className="h-5 w-5 text-yellow-500" />;
    case 'complete_ticket':
      return <CheckCircle className="h-5 w-5 text-purple-500" />;
  }
};

const MotionCard = motion(Card);

const ActivityCard: FC = () => {
  const latestActivities = activities.slice(0, 2);

  return (
    <MotionCard
      className="w-full h-[14.5rem]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)',
        transition: { duration: 0.2 },
      }}
    >
      <CardHeader>
        <CardTitle className="text-xl">Latest Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestActivities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <ActivityIcon type={activity.type} />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium">{activity.user}</p>
              <p className="text-sm text-muted-foreground">
                {activity.details}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </MotionCard>
  );
};

export default ActivityCard;
