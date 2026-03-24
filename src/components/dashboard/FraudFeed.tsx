import { AlertTriangle, User, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { FraudAlert } from '../../lib/mockData';
import { useI18n } from '../../context/LanguageContext';

interface FraudFeedProps {
  alerts: FraudAlert[];
}

const riskColors = {
  high: 'bg-red-500/20 border-red-500/30 text-red-400',
  medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
  low: 'bg-green-500/20 border-green-500/30 text-green-400',
};

export function FraudFeed({ alerts }: FraudFeedProps) {
  const { strings } = useI18n();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-red-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-white font-semibold">{strings.fraudDetection}</h3>
        <Badge variant="error" size="sm">{alerts.length}</Badge>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-xl border ${riskColors[alert.riskLevel]}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium">{alert.userName}</span>
              </div>
              <Badge
                variant={alert.riskLevel === 'high' ? 'error' : alert.riskLevel === 'medium' ? 'warning' : 'success'}
                size="sm"
              >
                {alert.score}%
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm mb-2">
              <FileText className="w-3 h-3" />
              <span className="opacity-80">{alert.claimId}</span>
            </div>

            <div className="space-y-1">
              {alert.reasons.map((reason, i) => (
                <p key={i} className="text-xs opacity-80">
                  • {reason}
                </p>
              ))}
            </div>

            <p className="text-xs mt-2 opacity-60">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

