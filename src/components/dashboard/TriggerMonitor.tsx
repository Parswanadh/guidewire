import { CheckCircle2, Activity, CloudRain, Thermometer, Wind, Wifi, Fuel, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Trigger } from '../../lib/mockData';
import { useI18n } from '../../context/LanguageContext';

interface TriggerMonitorProps {
  triggers: Trigger[];
}

const triggerIcons = {
  Rainfall: CloudRain,
  Heat: Thermometer,
  AQI: Wind,
  Platform: Activity,
  Internet: Wifi,
  Fuel: Fuel,
  Incentive: TrendingDown,
  Wind: Wind,
  Hail: CloudRain,
} as const;

const statusVariants = {
  resolved: 'success',
  active: 'error',
  pending: 'warning',
  warning: 'warning',
} as const;

export function TriggerMonitor({ triggers }: TriggerMonitorProps) {
  const { strings } = useI18n();

  if (triggers.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-400">{strings.noTriggers}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {triggers.map((trigger) => {
        const Icon = triggerIcons[trigger.type];

        return (
          <Card key={trigger.id} variant="glass" className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  trigger.status === 'active' ? 'bg-red-500/20' : 
                  trigger.status === 'warning' ? 'bg-yellow-500/20' : 
                  'bg-green-500/20'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    trigger.status === 'active' ? 'text-red-400' : 
                    trigger.status === 'warning' ? 'text-yellow-400' : 
                    'text-green-400'
                  }`} />
                </div>
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white font-medium">{strings[trigger.type]}</p>
                    <Badge variant={statusVariants[trigger.status]} size="sm">
                      {(strings as any)[trigger.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <span className="flex items-center gap-1 font-medium text-white">
                      {trigger.intensity}
                    </span>
                    <span>•</span>
                    <span>{trigger.timestamp}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-sm text-gray-300">{trigger.description}</p>
              {trigger.payout > 0 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-green-400 font-medium">Automatic Payout</span>
                  <span className="text-sm text-white font-bold">₹{trigger.payout}</span>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
