'use client';

import { motion } from 'framer-motion';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  total: number;
  metrics: {
    label: string;
    value: number;
    trend: 'up' | 'down';
  }[];
  icon: React.ReactNode;
}

const MotionCard = motion(Card);

const StatsCard = ({ title, total, metrics, icon }: StatCardProps) => {
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <span>{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{total.toLocaleString()}</div>
        <div className="mt-8 space-y-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{metric.label}</span>
              <span className="flex items-center gap-1">
                {metric.trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-rose-500" />
                )}
                {metric.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </MotionCard>
  );
};

export default StatsCard;
