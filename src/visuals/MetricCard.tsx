import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { GlowCard } from './GlowCard';
import { cn } from '../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    isPositive: boolean;
  };
  sparklineData?: Array<{ value: number }>;
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  sparklineData,
  icon,
  className,
}: MetricCardProps) {
  return (
    <GlowCard className={cn('p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <motion.p
            className="text-3xl font-bold text-ink mt-1"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            {value}
          </motion.p>
        </div>
        {icon && (
          <div className="p-2 rounded-xl bg-brand/10 text-brand">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {delta && (
          <motion.div
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium',
              delta.isPositive
                ? 'bg-ok/10 text-ok'
                : 'bg-red-500/10 text-red-500'
            )}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {delta.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{Math.abs(delta.value)}%</span>
          </motion.div>
        )}

        {sparklineData && (
          <div className="h-8 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--brand)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </GlowCard>
  );
}