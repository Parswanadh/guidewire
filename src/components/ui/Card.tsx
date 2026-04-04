import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'gradient' | 'glass';
}

const variantStyles = {
  default: 'sr-card-default',
  gradient: 'sr-card-gradient',
  glass: 'sr-card-glass',
};

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const baseClass = `
    ${variantStyles[variant]}
    rounded-2xl p-5 shadow-xl
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  if (onClick) {
    return (
      <motion.div
        className={baseClass}
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClass}>
      {children}
    </div>
  );
}
