import React from 'react';
import { motion } from 'framer-motion';
import { FileX, Inbox, Search } from 'lucide-react';

interface EmptyIllustrationProps {
  type?: 'tickets' | 'search' | 'general';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const illustrations = {
  tickets: {
    icon: Inbox,
    defaultTitle: 'No tickets yet',
    defaultDescription: 'When tickets are created, they will appear here.',
  },
  search: {
    icon: Search,
    defaultTitle: 'No results found',
    defaultDescription: 'Try adjusting your search or filter criteria.',
  },
  general: {
    icon: FileX,
    defaultTitle: 'Nothing here',
    defaultDescription: 'This area is currently empty.',
  },
};

export function EmptyIllustration({
  type = 'general',
  title,
  description,
  action,
}: EmptyIllustrationProps) {
  const config = illustrations[type];
  const Icon = config.icon;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand/20 to-brand-2/20 flex items-center justify-center">
          <Icon className="w-12 h-12 text-muted" />
        </div>
        
        {/* Floating particles */}
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-brand/30 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: `${80 + i * 10}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <motion.h3
        className="text-xl font-semibold text-ink mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        {title || config.defaultTitle}
      </motion.h3>

      <motion.p
        className="text-muted max-w-md mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {description || config.defaultDescription}
      </motion.p>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}