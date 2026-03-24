import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'purple' | 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

const colorStyles = {
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'purple',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-300">{label}</span>}
          {showValue && <span className="text-sm font-medium text-white">{value}</span>}
        </div>
      )}
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full ${colorStyles[color]} rounded-full`}
        />
      </div>
    </div>
  );
}

