import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Status } from '../../types';
import { cn } from '../../lib/utils';
import { Check, Clock, Play, CheckCircle, XCircle } from 'lucide-react';

interface StatusStepperProps {
  currentStatus: Status;
  onStatusChange?: (status: Status) => void;
  disabled?: boolean;
  className?: string;
}

const statuses: Status[] = ['open', 'in_progress', 'resolved', 'closed'];
const statusLabels: Record<Status, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const statusIcons: Record<Status, React.ComponentType<any>> = {
  open: Clock,
  in_progress: Play,
  resolved: CheckCircle,
  closed: XCircle,
};

export function StatusStepper({ 
  currentStatus, 
  onStatusChange,
  disabled = false,
  className 
}: StatusStepperProps) {
  const currentIndex = statuses.indexOf(currentStatus);
  const [showConfirm, setShowConfirm] = React.useState<Status | null>(null);

  const handleStatusClick = (status: Status, index: number) => {
    if (disabled || !onStatusChange) return;
    
    // Only allow forward progression or current status
    if (index < currentIndex) return;
    
    // Show confirmation for closing or reopening
    if (status === 'closed' || (currentStatus === 'closed' && status !== 'closed')) {
      setShowConfirm(status);
    } else {
      onStatusChange(status);
    }
  };

  const confirmStatusChange = () => {
    if (showConfirm && onStatusChange) {
      onStatusChange(showConfirm);
    }
    setShowConfirm(null);
  };
  return (
    <>
      <div className={cn('flex items-center space-x-4', className)}>
        {statuses.map((status, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const isClickable = onStatusChange && !disabled && index >= currentIndex;
          const StatusIcon = statusIcons[status];
          
          return (
            <React.Fragment key={status}>
              <div className="flex items-center space-x-3">
                <motion.div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 relative',
                    {
                      'bg-gradient-to-br from-brand to-brand-2 border-brand text-white shadow-lg': isActive,
                      'border-border text-muted hover:border-brand/50': !isActive,
                      'ring-4 ring-brand/20 scale-110': isCurrent && isActive,
                      'cursor-pointer hover:scale-105': isClickable,
                      'cursor-not-allowed opacity-50': disabled,
                    }
                  )}
                  onClick={() => handleStatusClick(status, index)}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                >
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <StatusIcon className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        className="text-xs font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Pulse effect for current status */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-brand"
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                <div className="flex flex-col">
                  <span
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isActive ? 'text-ink' : 'text-muted'
                    )}
                  >
                    {statusLabels[status]}
                  </span>
                  {isCurrent && (
                    <motion.span
                      className="text-xs text-brand font-medium"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Current
                    </motion.span>
                  )}
                </div>
              </div>
              
              {index < statuses.length - 1 && (
                <div className="relative">
                  <div className="h-0.5 w-12 bg-border rounded-full" />
                  <motion.div
                    className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-brand to-brand-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: index < currentIndex ? '100%' : '0%' 
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass rounded-2xl p-6 max-w-md mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-ink mb-2">
                Confirm Status Change
              </h3>
              <p className="text-muted mb-6">
                Are you sure you want to change the status to "{statusLabels[showConfirm]}"?
                {showConfirm === 'closed' && ' This action will close the ticket.'}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(null)}
                  className="px-4 py-2 text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-gradient-to-r from-brand to-brand-2 text-white rounded-xl hover:shadow-lg transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}