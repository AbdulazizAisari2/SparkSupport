import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
  hover?: boolean;
}

export function GlowCard({ 
  children, 
  className, 
  glow = true, 
  hover = true,
  ...props 
}: GlowCardProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      className={cn(
        'glass rounded-2xl p-6 relative overflow-hidden',
        glow && 'glow-effect',
        hover && 'hover:scale-[1.02] transition-transform duration-200',
        'focus-within:ring-2 focus-within:ring-brand/50',
        className
      )}
      style={
        glow
          ? {
              '--mx': `${mousePosition.x}%`,
              '--my': `${mousePosition.y}%`,
            } as React.CSSProperties
          : undefined
      }
      onMouseMove={glow ? handleMouseMove : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}