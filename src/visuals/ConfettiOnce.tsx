import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

interface ConfettiOnceProps {
  trigger: boolean;
  onComplete?: () => void;
}

const colors = ['#6d5efc', '#22c55e', '#f59e0b', '#38bdf8', '#10b981', '#f97316'];

export function ConfettiOnce({ trigger, onComplete }: ConfettiOnceProps) {
  const [pieces, setPieces] = React.useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    if (trigger && !isActive) {
      // Check if confetti has been shown before
      const hasShownConfetti = localStorage.getItem('spark-confetti-shown');
      if (hasShownConfetti) return;

      setIsActive(true);
      
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
      }));
      
      setPieces(newPieces);
      
      // Mark as shown
      localStorage.setItem('spark-confetti-shown', 'true');
      
      // Clean up after animation
      setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            backgroundColor: piece.color,
            left: piece.x,
            top: piece.y,
            scale: piece.scale,
          }}
          initial={{
            y: -20,
            rotation: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotation: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}