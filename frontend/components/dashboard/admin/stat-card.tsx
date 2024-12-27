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

const StatCard = ({ title, total, metrics, icon }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{total.toLocaleString()}</div>
          <div className="mt-4 space-y-2">
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
      </Card>
    </motion.div>
  );
};

export default StatCard;
