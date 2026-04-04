import { TrendingDown, TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useI18n } from '../../context/LanguageContext';

interface LossRatioGaugeProps {
  value: number;
  target?: number;
  provenance?: string;
}

export function LossRatioGauge({ value, target = 65, provenance }: LossRatioGaugeProps) {
  const { strings } = useI18n();

  const isGood = value <= target;
  const percentage = Math.min(value, 100);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <Card>
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <h3 className="text-gray-300 font-medium">{strings.lossRatio}</h3>
          <div className={`ml-2 p-1 rounded-lg ${isGood ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {isGood ? (
              <TrendingDown className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>

        {/* SVG Gauge */}
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke="#1f2937"
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r="54"
              fill="none"
              stroke={isGood ? '#22c55e' : '#ef4444'}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center value */}
          <div className="absolute">
            <p className={`text-4xl font-bold ${isGood ? 'text-green-400' : 'text-red-400'}`}>
              {value}%
            </p>
            <p className="text-xs text-gray-400 mt-1">vs {target}% target</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mt-4">
          {isGood ? 'Within acceptable range' : 'Above target - review needed'}
        </p>

        {provenance && (
          <p className="text-[11px] text-gray-500 mt-3">{provenance}</p>
        )}
      </div>
    </Card>
  );
}

