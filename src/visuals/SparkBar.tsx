import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface SparkBarProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export function SparkBar({
  data,
  color = 'var(--brand)',
  height = 32,
  className,
}: SparkBarProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  return (
    <div className={cn('flex items-end space-x-1', className)} style={{ height }}>
      {data.map((value, index) => {
        const normalizedHeight = ((value - minValue) / range) * height;
        
        return (
          <motion.div
            key={index}
            className="flex-1 rounded-sm"
            style={{
              backgroundColor: color,
              minHeight: '2px',
            }}
            initial={{ height: 0 }}
            animate={{ height: normalizedHeight }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}