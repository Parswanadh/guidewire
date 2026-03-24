import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { useI18n } from '../../context/LanguageContext';

interface ReserveForecastPanelProps {
  current: number;
  projected: number;
}

export function ReserveForecastPanel({ current, projected }: ReserveForecastPanelProps) {
  const { strings } = useI18n();

  const growth = ((projected - current) / current) * 100;

  // Generate mock trend data
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const ratio = 1 + (i * 0.1);
    return current * ratio;
  });

  const maxVal = Math.max(...trendData, projected);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-xl">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold">{strings.reserveForecast}</h3>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-400 text-xs mb-1">Current</p>
          <p className="text-white font-semibold">₹{(current / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-black/30 rounded-xl p-3">
          <p className="text-gray-400 text-xs mb-1">Projected</p>
          <p className="text-green-400 font-semibold">₹{(projected / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Simple Chart */}
      <div className="h-32 flex items-end gap-1 mb-3">
        {trendData.map((val, i) => (
          <div
            key={i}
            className="flex-1 bg-blue-500/30 hover:bg-blue-500/50 rounded-t transition-colors relative group"
            style={{ height: `${(val / maxVal) * 100}%` }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              ₹{(val / 100000).toFixed(1)}L
            </span>
          </div>
        ))}
        <div
          className="flex-1 bg-green-500/50 rounded-t"
          style={{ height: `${(projected / maxVal) * 100}%` }}
        />
      </div>

      {/* Growth Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">{strings.lastUpdated}: Today</span>
        <span className={`font-medium ${growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
        </span>
      </div>
    </Card>
  );
}

