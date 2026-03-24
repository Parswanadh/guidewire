import { Shield, Calendar, IndianRupee } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { useI18n } from '../../context/LanguageContext';

interface ShieldStatusCardProps {
  isActive: boolean;
  activeSince: string;
  expiresOn: string;
  remainingDays: number;
  todayEarnings: number;
  coverageAmount: number;
}

export function ShieldStatusCard({
  isActive,
  activeSince,
  expiresOn,
  remainingDays,
  todayEarnings,
  coverageAmount,
}: ShieldStatusCardProps) {
  const { strings } = useI18n();

  return (
    <Card variant="gradient" className="relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isActive ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
              <Shield className={`w-6 h-6 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{strings.yourShield}</h3>
              <Badge variant={isActive ? 'success' : 'default'}>
                {isActive ? strings.shieldActive : strings.shieldInactive}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <Calendar className="w-4 h-4" />
              <span>{strings.activeSince}</span>
            </div>
            <p className="text-white font-semibold">{activeSince}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <IndianRupee className="w-4 h-4" />
              <span>{strings.todaysEarnings}</span>
            </div>
            <p className="text-white font-semibold">₹{todayEarnings.toLocaleString()}</p>
          </div>
        </div>

        {/* Coverage Amount */}
        <div className="bg-black/20 rounded-xl p-3 mb-4">
          <p className="text-gray-400 text-sm mb-1">{strings.coverageAmount}</p>
          <p className="text-white font-bold text-2xl">₹{coverageAmount.toLocaleString()}</p>
        </div>

        {/* Days Remaining */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">{strings.expiresOn}: {expiresOn}</span>
            <span className="text-white font-medium">{remainingDays} {strings.daysRemaining}</span>
          </div>
          <ProgressBar value={remainingDays} max={30} color="purple" />
        </div>
      </div>
    </Card>
  );
}


